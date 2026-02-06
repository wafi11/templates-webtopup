package transaction

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"time"
)

type Repository struct {
	db            *sql.DB
	duitkuService *DuitkuService
}

func NewRepository(db *sql.DB, duitku *DuitkuService) Repository {
	return Repository{db: db, duitkuService: duitku}
}

func (r *Repository) Create(c context.Context, request TransactionRequest, define DefineRequest, transactionId string) (*TransactionCreateResponse, MessageResponse, ErrorCode) {
	tx, err := r.db.BeginTx(c, &sql.TxOptions{
		Isolation: sql.LevelDefault,
		ReadOnly:  false,
	})
	if err != nil {
		log.Printf("failed to begin transaction: %v", err)
		return nil, DATABASE_ERROR, CODE_DATABASE_ERROR
	}

	defer func() {
		if err != nil {
			if rbErr := tx.Rollback(); rbErr != nil {
				log.Printf("failed to rollback transaction: %v", rbErr)
			}
		}
	}()

	// 2. Validate product
	product, message, code := r.validationProduct(c, request.ProductCode, tx)
	if code != CODE_VALIDATION_SUCCESS {
		err = sql.ErrTxDone
		return nil, message, code
	}

	var voucher *ValidationVoucherReturn
	if request.VoucherCode != "" {
		voucher = r.validationVoucher(c, tx, request.VoucherCode, product.BasePrice)
		product.BasePrice = product.BasePrice - voucher.TotalDiscount
	}

	// 3. Validate payment method
	payment, message, code := r.validationPaymentMethod(c, product.BasePrice, request.PaymentCode)
	if code != CODE_VALIDATION_SUCCESS {
		err = sql.ErrTxDone
		return nil, message, code
	}

	logRequest := map[string]interface{}{
		"PaymentAmount":   int(payment.TotalAmount),
		"MerchantOrderId": transactionId,
		"PaymentCode":     request.PaymentCode,
		"CallbackUrl":     "http://localhost:7000",
	}
	logRequestJSON, _ := json.Marshal(logRequest)

	metadata := map[string]interface{}{
		"product_name":   product.ProductName,
		"customer_phone": request.CustomerPhone,
		"device_info": map[string]string{
			"platform":   define.UserAgent,
			"ip_address": define.IpAddress,
		},
	}

	metadataJSON, _ := json.Marshal(metadata)

	// 5. Insert transaction ke database
	r.InsertTransaction(c, tx, InsertTransaction{
		DefineRequest:      define,
		TransactionRequest: request,
		ReferenceId:        transactionId,
		InvoiceNumber:      transactionId,
		ExternalId:         transactionId,
		ProviderId:         1,
		PaymentMethod:      payment.PaymentMethod,
		Price:              product.BasePrice,
		Discount:           product.DiscountPrice,
		Amount:             product.BasePrice * int64(request.Quantity),
		Fee:                payment.TotalTax,
		Tax:                0,
		Total:              payment.TotalAmount,
		Metadata:           string(metadataJSON),
		LogRequest:         string(logRequestJSON),
		LogResponse:        "",
		PaymentUrl:         "",
	})

	// 6. Commit transaction
	if err = tx.Commit(); err != nil {
		log.Printf("failed to commit transaction: %v", err)
		return nil, TRANSACTION_CANCELLED, CODE_TRANSACTION_CANCELLED
	}

	// 8. Return response
	return &TransactionCreateResponse{ReferenceID: transactionId}, VALIDATION_SUCCESS, CODE_VALIDATION_SUCCESS
}
func (r *Repository) PushToPaymentGateway(c context.Context, transactionId string) error {
	// 1. Start database transaction
	tx, err := r.db.BeginTx(c, nil)
	if err != nil {
		log.Printf("failed to begin transaction: %v", err)
		return err
	}
	defer tx.Rollback() // Auto rollback kalau ada error

	// 2. Get transaction data
	var total int64
	var paymentCode string
	query := `
		SELECT 
			total,
			payment_code 
		FROM transactions 
		WHERE invoice_number = $1  
	`
	err = tx.QueryRowContext(c, query, transactionId).Scan(&total, &paymentCode)
	if err != nil {
		log.Printf("failed to get transaction: %v", err)
		return err
	}

	// 3. Create Duitku transaction (external API call - SEBELUM commit)
	responseDuitku, err := r.duitkuService.CreateTransaction(c, &DuitkuCreateTransactionParams{
		PaymentAmount:   int(total),
		MerchantOrderId: transactionId,
		PaymentCode:     paymentCode,
		CallbackUrl:     "http://localhost:7000/callback/duitku",
	})
	if err != nil {
		log.Printf("duitku create transaction failed: %v", err)
		return fmt.Errorf("payment gateway error: %w", err)
	}

	// 4. Prepare response data
	logResponseJSON, _ := json.Marshal(responseDuitku)
	paymentURL := firstNonEmpty(responseDuitku.QrString, responseDuitku.VANumber, responseDuitku.PaymentUrl)

	// 5. Update transaction dengan response dari Duitku
	updateQuery := `
		UPDATE transactions 
		SET 
			log_response = $1,
			payment_url = $2,
			external_id = $3,
			updated_at = NOW()
		WHERE invoice_number = $4
	`
	_, err = tx.ExecContext(c, updateQuery,
		string(logResponseJSON),
		paymentURL,
		responseDuitku.Reference,
		transactionId,
	)
	if err != nil {
		log.Printf("failed to update transaction: %v", err)
		return err
	}

	// 6. Commit transaction - semua sukses!
	if err = tx.Commit(); err != nil {
		log.Printf("failed to commit transaction: %v", err)
		return err
	}

	log.Printf("successfully pushed transaction %s to payment gateway", transactionId)
	return nil
}

func (r *Repository) InsertTransaction(c context.Context, tx *sql.Tx, req InsertTransaction) (MessageResponse, ErrorCode) {
	userId := 1
	_, err := tx.ExecContext(c, INSERT_QUERY,
		userId, req.ProductCode, req.ProviderId,
		req.ReferenceId, req.InvoiceNumber, req.ExternalId,
		"PENDING", req.PaymentMethod, req.PaymentCode, req.PaymentUrl, req.Price, req.Quantity,
		req.Amount, req.Discount, req.VoucherCode, req.Fee, req.Tax, req.Total,
		req.CustomerEmail, req.CustomerPhone, req.Destination, req.Metadata, req.IpAddress, req.UserAgent, time.Now(), time.Now(),
		req.LogRequest, req.LogResponse,
	)

	if err != nil {
		log.Printf("error : %s", err.Error())
		return INTERNAL_SERVER_ERROR, CODE_INTERNAL_SERVER_ERROR
	}

	return VALIDATION_SUCCESS, CODE_VALIDATION_SUCCESS
}

func (r *Repository) FindInvoice(c context.Context, invoiceId string) (*FindInvoice, MessageResponse, ErrorCode) {
	var result FindInvoice
	err := r.db.QueryRowContext(c, FIND_INVOICE, invoiceId).Scan(
		&result.PaymentMethod,
		&result.PaymentUrl,
		&result.SerialNumber,
		&result.Status,
		&result.Destination,
		&result.Price,
		&result.Quantity,
		&result.Amount,
		&result.Tax,
		&result.Total,
		&result.Discount,
		&result.CreatedAt,
		&result.UpdatedAt,
		&result.ProductName,
		&result.ProductItemName,
		&result.ProductImage,
	)
	if err != nil {
		log.Printf("err : %s", err.Error())
		return nil, TRANSACTION_NOT_FOUND, CODE_TRANSACTION_NOT_FOUND
	}
	return &result, VALIDATION_SUCCESS, CODE_VALIDATION_SUCCESS
}

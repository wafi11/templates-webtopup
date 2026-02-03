package transaction

import (
	"context"
	"database/sql"
	"encoding/json"
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

func (r *Repository) Create(c context.Context, request TransactionRequest, define DefineRequest) (*TransactionCreateResponse, MessageResponse, ErrorCode) {
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

	// 3. Validate payment method
	payment, message, code := r.validationPaymentMethod(c, product.BasePrice, request.PaymentCode)
	if code != CODE_VALIDATION_SUCCESS {
		err = sql.ErrTxDone
		return nil, message, code
	}

	// 4. Generate transaction ID
	transactionId := generateRandomId()

	logRequest := map[string]interface{}{
		"PaymentAmount":   int(payment.TotalAmount),
		"MerchantOrderId": transactionId,
		"PaymentCode":     request.PaymentCode,
		"CallbackUrl":     "http://localhost:7000",
	}
	logRequestJSON, _ := json.Marshal(logRequest)

	// 5. Create Duitku transaction SEBELUM commit database
	responseDuitku, err := r.duitkuService.CreateTransaction(c, &DuitkuCreateTransactionParams{
		PaymentAmount:   int(payment.TotalAmount),
		MerchantOrderId: transactionId,
		PaymentCode:     request.PaymentCode,
		CallbackUrl:     "http://localhost:7000",
	})

	if err != nil {
		log.Printf("duitku create transaction failed: %v", err)
		return nil, PAYMENT_GATEWAY_ERROR, CODE_PAYMENT_GATEWAY_ERROR
	}

	metadata := map[string]interface{}{
		"product_name":   product.ProductName,
		"customer_phone": request.CustomerPhone,
		"device_info": map[string]string{
			"platform":   define.UserAgent,
			"ip_address": define.IpAddress,
		},
	}
	log.Println("response duitku : ", responseDuitku)

	metadataJSON, _ := json.Marshal(metadata)
	logResponseJSON, _ := json.Marshal(responseDuitku)
	paymentURL := firstNonEmpty(responseDuitku.QrString, responseDuitku.VANumber, responseDuitku.PaymentUrl)

	// // 6. Insert transaction ke database
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
		LogResponse:        string(logResponseJSON),
		PaymentUrl:         paymentURL,
	})

	// 7. Commit transaction
	if err = tx.Commit(); err != nil {
		log.Printf("failed to commit transaction: %v", err)
		return nil, TRANSACTION_CANCELLED, CODE_TRANSACTION_CANCELLED
	}

	// 8. Return response
	return &TransactionCreateResponse{ReferenceID: transactionId}, VALIDATION_SUCCESS, CODE_VALIDATION_SUCCESS
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

package transaction

import "time"

const (
	INSERT_QUERY string = `
	insert into transactions (
		user_id,           -- 1
		product_code,      -- 2
		provider_id,       -- 3
		reference_id,      -- 4
		invoice_number,    -- 5
		external_id,       -- 6
		status,            -- 7
		payment_method,    -- 8
		payment_code,      -- 9
		payment_url,       -- 10
		price,             -- 11
		quantity,          -- 12
		amount,            -- 13
		discount_price,    -- 14
		voucher_code,      -- 15
		fee,               -- 16
		tax,               -- 17
		total,             -- 18
		customer_email,    -- 19
		customer_phone,    -- 20
		destination,       -- 21
		metadata,          -- 22
		ip_address,        -- 23
		user_agent,        -- 24
		created_at,        -- 25
		updated_at,        -- 26
		log_request,       -- 27
		log_response       -- 28
	) VALUES (
		$1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
		$11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
		$21, $22, $23, $24, $25, $26, $27, $28
	)
	`

	FIND_INVOICE string = `
		select 
			pm.name,
			t.payment_url,
			t.serial_number,
			t.status,
			t.destination,
			t.price,
			t.quantity,
			t.amount,
			t.fee,
			t.total,
			t.discount_price,
			t.created_at,
			t.updated_at,
			p.name as product_name,
			pi.name as product_item_name,
			p.thumbnail as product_image
		from transactions t
		left join product_items pi on pi.code = t.product_code
		left join products p on p.id = pi.product_id
		left join payment_methods pm  on pm.code = t.payment_code
		where t.invoice_number = $1
	`
)

type Transaction struct {
	ID            int64     `json:"id"`
	UserID        int64     `json:"userId"`
	ProductCode   string    `json:"productCode"`
	ProviderID    int       `json:"providerId"`
	ReferenceID   string    `json:"referenceId "`
	InvoiceNumber string    `json:"invoiceNumber"`
	ExternalId    string    `json:"externalId"`
	Status        string    `json:"status"`
	PaymentCode   string    `json:"paymentCode"`
	PaymentUrl    string    `json:"paymentURL"`
	VoucherCode   string    `json:"voucherCode"`
	Price         int64     `json:"price"`
	Quantity      int       `json:"quantity"`
	Amount        int       `json:"amount"`
	DiscountPrice int       `json:"discountPrice"`
	Fee           int       `json:"fee"`
	Tax           int       `json:"tax"`
	Total         int64     `json:"total"`
	CustomerEmail *string   `json:"customerEmail,omitempty"`
	CustomerPhone string    `json:"customerPhone"`
	Destination   string    `json:"destination"`
	SerialNumber  string    `json:"serialNumber"`
	LogRequest    string    `json:"logRequest"`
	LogResponse   string    `json:"logResponse"`
	LogCallback   string    `json:"logCallback"`
	ErrorMessage  string    `json:"errorMessage"`
	Metadata      string    `json:"metadata"`
	IpAddress     string    `json:"ipAddress"`
	UserAgent     string    `json:"userAggent"`
	PaymentAt     time.Time `json:"paymentAt"`
	ExpiresAt     time.Time `json:"expiresAt"`
	CompletedAt   time.Time `json:"completedAt"`
	CancelledAt   time.Time `json:"cancelledAt"`
	RefundedAt    time.Time `json:"refundedAt"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

type TransactionRequest struct {
	ProductCode   string  `json:"productCode"`
	PaymentCode   string  `json:"paymentCode"`
	VoucherCode   string  `json:"voucherCode"`
	CustomerEmail *string `json:"customerEmail,omitempty"`
	CustomerPhone string  `json:"customerPhone"`
	Destination   string  `json:"destination"`
	Quantity      int     `json:"quantity"`
}

type TransactionOrder struct {
	TransactionRequest
	DefineRequest
	TransactionId string
}

type InsertTransaction struct {
	TransactionRequest
	DefineRequest
	LogRequest    string
	LogResponse   string
	ReferenceId   string
	InvoiceNumber string
	ExternalId    string
	ProviderId    int8
	PaymentMethod string
	PaymentUrl    string
	Price         int64
	Amount        int64
	Discount      int64
	Fee           int64
	Tax           int64
	Total         int64
	Metadata      string
}

type TransactionCreateResponse struct {
	ReferenceID string `json:"referenceId"`
}

type DefineRequest struct {
	UserAgent string `json:"userAgent,omitempty"`
	IpAddress string `json:"ipAddress"`
}

type ProductValidation struct {
	ProductName   string
	BasePrice     int64
	ProductStock  int
	DiscountPrice int64
	IsActive      bool
}

type FindInvoice struct {
	PaymentMethod   string    `json:"paymentMethod"`
	PaymentUrl      string    `json:"paymentUrl"`
	SerialNumber    *string   `json:"serialNumber"`
	Status          string    `json:"status"`
	Destination     string    `json:"destination"`
	Price           int64     `json:"price"`
	Quantity        int8      `json:"quantity"`
	Amount          int64     `json:"amount"`
	Tax             int64     `json:"tax"`
	Total           int64     `json:"total"`
	Discount        int64     `json:"discount"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
	ProductName     string    `json:"productName"`
	ProductItemName string    `json:"productItemName"`
	ProductImage    string    `json:"productImage"`
}

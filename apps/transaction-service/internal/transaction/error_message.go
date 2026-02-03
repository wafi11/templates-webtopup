package transaction

type MessageResponse string
type ErrorCode int

const (
	VALIDATION_SUCCESS MessageResponse = "SUCCESS"
	// Balance & Payment
	INSUFFICIENT_BALANCE MessageResponse = "INSUFFICIENT_BALANCE"
	PAYMENT_EXPIRED      MessageResponse = "PAYMENT_EXPIRED"
	PAYMENT_FAILED       MessageResponse = "PAYMENT_FAILED"
	PAYMENT_PENDING      MessageResponse = "PAYMENT_PENDING"
	PAYMENT_ALREADY_PAID MessageResponse = "PAYMENT_ALREADY_PAID"
	// Validation
	MISSING_BODY_REQUEST MessageResponse = "INVALID_BODY_REQUEST"
	INVALID_QUANTITY     MessageResponse = "INVALID_QUANTITY"
	INVALID_DESTINATION  MessageResponse = "INVALID_DESTINATION"
	INVALID_PHONE_NUMBER MessageResponse = "INVALID_PHONE_NUMBER"
	INVALID_EMAIL        MessageResponse = "INVALID_EMAIL"
	INVALID_AMOUNT       MessageResponse = "INVALID_AMOUNT"

	// Product & Provider
	PRODUCT_NOT_FOUND    MessageResponse = "PRODUCT_NOT_FOUND"
	PRODUCT_OUT_OF_STOCK MessageResponse = "PRODUCT_OUT_OF_STOCK"
	PRODUCT_INACTIVE     MessageResponse = "PRODUCT_INACTIVE"
	PROVIDER_NOT_FOUND   MessageResponse = "PROVIDER_NOT_FOUND"
	PROVIDER_UNAVAILABLE MessageResponse = "PROVIDER_UNAVAILABLE"
	PROVIDER_MAINTENANCE MessageResponse = "PROVIDER_MAINTENANCE"

	// Transaction
	TRANSACTION_NOT_FOUND  MessageResponse = "TRANSACTION_NOT_FOUND"
	TRANSACTION_CANCELLED  MessageResponse = "TRANSACTION_CANCELLED"
	TRANSACTION_EXPIRED    MessageResponse = "TRANSACTION_EXPIRED"
	DUPLICATE_TRANSACTION  MessageResponse = "DUPLICATE_TRANSACTION"
	TRANSACTION_PROCESSING MessageResponse = "TRANSACTION_PROCESSING"

	// Payment Method
	PAYMENT_CODE_NOT_FOUND MessageResponse = "PAYMENT_CODE_NOT_FOUND"
	PAYMENT_METHOD_INVALID MessageResponse = "PAYMENT_METHOD_INVALID"
	PAYMENT_GATEWAY_ERROR  MessageResponse = "PAYMENT_GATEWAY_ERROR"

	// Voucher
	VOUCHER_INVALID      MessageResponse = "VOUCHER_INVALID"
	VOUCHER_EXPIRED      MessageResponse = "VOUCHER_EXPIRED"
	VOUCHER_ALREADY_USED MessageResponse = "VOUCHER_ALREADY_USED"
	VOUCHER_MIN_AMOUNT   MessageResponse = "VOUCHER_MIN_AMOUNT_NOT_MET"

	// Rate Limiting
	RATE_LIMIT_EXCEEDED MessageResponse = "RATE_LIMIT_EXCEEDED"

	// Generic
	INTERNAL_SERVER_ERROR MessageResponse = "INTERNAL_SERVER_ERROR"
	SERVICE_UNAVAILABLE   MessageResponse = "SERVICE_UNAVAILABLE"
	UNAUTHORIZED          MessageResponse = "UNAUTHORIZED"
	FORBIDDEN             MessageResponse = "FORBIDDEN"
	DATABASE_ERROR        MessageResponse = "DATABASE ERR0R"
	TIMEOUT_ERROR         MessageResponse = "TIMEDOUT"
)
const (
	CODE_VALIDATION_SUCCESS ErrorCode = 1

	// 1xxx - Balance & Payment
	CODE_INSUFFICIENT_BALANCE ErrorCode = 1001
	CODE_PAYMENT_EXPIRED      ErrorCode = 1002
	CODE_PAYMENT_FAILED       ErrorCode = 1003
	CODE_PAYMENT_PENDING      ErrorCode = 1004
	CODE_PAYMENT_ALREADY_PAID ErrorCode = 1005

	// 2xxx - Validation
	CODE_MISSING_BODY_REQUEST ErrorCode = 2001
	CODE_INVALID_QUANTITY     ErrorCode = 2002
	CODE_INVALID_DESTINATION  ErrorCode = 2003
	CODE_INVALID_PHONE_NUMBER ErrorCode = 2004
	CODE_INVALID_EMAIL        ErrorCode = 2005
	CODE_INVALID_AMOUNT       ErrorCode = 2006

	// 3xxx - Product & Provider
	CODE_PRODUCT_NOT_FOUND    ErrorCode = 3001
	CODE_PRODUCT_OUT_OF_STOCK ErrorCode = 3002
	CODE_PRODUCT_INACTIVE     ErrorCode = 3003
	CODE_PROVIDER_NOT_FOUND   ErrorCode = 3004
	CODE_PROVIDER_UNAVAILABLE ErrorCode = 3005
	CODE_PROVIDER_MAINTENANCE ErrorCode = 3006

	// 4xxx - Transaction
	CODE_TRANSACTION_NOT_FOUND  ErrorCode = 4001
	CODE_TRANSACTION_CANCELLED  ErrorCode = 4002
	CODE_TRANSACTION_EXPIRED    ErrorCode = 4003
	CODE_DUPLICATE_TRANSACTION  ErrorCode = 4004
	CODE_TRANSACTION_PROCESSING ErrorCode = 4005

	// 5xxx - Payment Method
	CODE_PAYMENT_CODE_NOT_FOUND ErrorCode = 5001
	CODE_PAYMENT_METHOD_INVALID ErrorCode = 5002
	CODE_PAYMENT_GATEWAY_ERROR  ErrorCode = 5003

	// 6xxx - Voucher
	CODE_VOUCHER_INVALID      ErrorCode = 6001
	CODE_VOUCHER_EXPIRED      ErrorCode = 6002
	CODE_VOUCHER_ALREADY_USED ErrorCode = 6003
	CODE_VOUCHER_MIN_AMOUNT   ErrorCode = 6004

	// 7xxx - Rate Limiting & Security
	CODE_RATE_LIMIT_EXCEEDED ErrorCode = 7001
	CODE_UNAUTHORIZED        ErrorCode = 7002
	CODE_FORBIDDEN           ErrorCode = 7003

	// 9xxx - Generic/Server Errors
	CODE_INTERNAL_SERVER_ERROR ErrorCode = 9001
	CODE_SERVICE_UNAVAILABLE   ErrorCode = 9002
	CODE_DATABASE_ERROR        ErrorCode = 9003
	CODE_TIMEOUT_ERROR         ErrorCode = 9004
)

// Error response structure
type ErrorResponse struct {
	Code    MessageResponse `json:"code"`
	Message string          `json:"message"`
	Details interface{}     `json:"details,omitempty"`
}

// Map error codes to user-friendly messages
var ErrorMessages = map[MessageResponse]string{
	INSUFFICIENT_BALANCE: "Saldo tidak mencukupi",
	PAYMENT_EXPIRED:      "Pembayaran telah kadaluarsa",
	PAYMENT_FAILED:       "Pembayaran gagal",
	PAYMENT_PENDING:      "Pembayaran sedang diproses",
	PAYMENT_ALREADY_PAID: "Transaksi sudah dibayar",

	MISSING_BODY_REQUEST: "Data request tidak valid",
	INVALID_QUANTITY:     "Jumlah quantity tidak valid",
	INVALID_DESTINATION:  "Nomor tujuan tidak valid",
	INVALID_PHONE_NUMBER: "Nomor telepon tidak valid",
	INVALID_EMAIL:        "Email tidak valid",
	INVALID_AMOUNT:       "Jumlah pembayaran tidak valid",

	PRODUCT_NOT_FOUND:    "Produk tidak ditemukan atau sudah ditutup",
	PRODUCT_OUT_OF_STOCK: "Produk sedang habis",
	PRODUCT_INACTIVE:     "Produk tidak aktif",
	PROVIDER_NOT_FOUND:   "Provider tidak ditemukan",
	PROVIDER_UNAVAILABLE: "Provider sedang tidak tersedia",
	PROVIDER_MAINTENANCE: "Provider sedang maintenance",

	TRANSACTION_NOT_FOUND:  "Transaksi tidak ditemukan",
	TRANSACTION_CANCELLED:  "Transaksi dibatalkan",
	TRANSACTION_EXPIRED:    "Transaksi kadaluarsa",
	DUPLICATE_TRANSACTION:  "Transaksi duplikat",
	TRANSACTION_PROCESSING: "Transaksi sedang diproses",

	PAYMENT_CODE_NOT_FOUND: "Metode pembayaran tidak ditemukan",
	PAYMENT_METHOD_INVALID: "Metode pembayaran tidak valid",

	VOUCHER_INVALID:      "Kode voucher tidak valid",
	VOUCHER_EXPIRED:      "Voucher sudah kadaluarsa",
	VOUCHER_ALREADY_USED: "Voucher sudah pernah digunakan",
	VOUCHER_MIN_AMOUNT:   "Minimal transaksi untuk voucher tidak terpenuhi",

	RATE_LIMIT_EXCEEDED: "Terlalu banyak request, coba lagi nanti",

	INTERNAL_SERVER_ERROR: "Terjadi kesalahan server",
	SERVICE_UNAVAILABLE:   "Layanan sedang tidak tersedia",
	UNAUTHORIZED:          "Unauthorized",
	FORBIDDEN:             "Forbidden",
	DATABASE_ERROR:        "Database Error",
	TIMEOUT_ERROR:         "Timedout Connection",
}

// Helper function to create error response
func NewErrorResponse(code MessageResponse, details ...interface{}) *ErrorResponse {
	resp := &ErrorResponse{
		Code:    code,
		Message: ErrorMessages[code],
	}

	if len(details) > 0 {
		resp.Details = details[0]
	}

	return resp
}
func (e ErrorCode) HTTPStatus() int {
	switch {
	case e == 1:
		return 201
	case e >= 1000 && e < 2000:
		return 400 // Payment errors
	case e >= 2000 && e < 3000:
		return 400 // Validation errors
	case e >= 3000 && e < 4000:
		return 404 // Product/Provider errors
	case e >= 4000 && e < 5000:
		return 400 // Transaction errors
	case e >= 5000 && e < 6000:
		return 400 // Payment method errors
	case e >= 6000 && e < 7000:
		return 400 // Voucher errors
	case e >= 7000 && e < 8000:
		if e == CODE_UNAUTHORIZED {
			return 401
		}
		if e == CODE_FORBIDDEN {
			return 403
		}
		return 429
	case e >= 9000:
		return 500
	default:
		return 500
	}
}

package transaction

type DuitkuCreateTransactionParams struct {
	PaymentAmount   int    `json:"paymentAmount"`
	MerchantOrderId string `json:"merchantOrderId"`
	PaymentCode     string `json:"paymentCode"`
	CallbackUrl     string `json:"callbackUrl,omitempty"`
	ReturnUrl       string `json:"returnUrl,omitempty"`
}

type ResponseFromDuitkuCheckTransaction struct {
	Status int `json:"status"`
	Data   struct {
		MerchantOrderId string `json:"merchantOrderId"`
		Reference       string `json:"reference"`
		Amount          string `json:"amount"`
		Fee             string `json:"fee"`
		StatusCode      string `json:"statusCode"`
		StatusMessage   string `json:"statusMessage"`
	} `json:"data"`
}

type DuitkuCreateTransactionResponse struct {
	Status        string `json:"status"`
	Code          string `json:"code"`
	Message       string `json:"message"`
	QrString      string `json:"qrString,omitempty"`
	VANumber      string `json:"vaNumber,omitempty"`
	PaymentUrl    string `json:"paymentUrl,omitempty"`
	Amount        string `json:"amount,omitempty"`
	Reference     string `json:"reference,omitempty"`
	StatusCode    string `json:"statusCode,omitempty"`
	StatusMessage string `json:"statusMessage,omitempty"`
}

type CallbackDataDuitku struct {
	MerchantCode    string `json:"merchantOrderId"`
	Amount          int64  `json:"Amount"`
	RefId           string `json:"refId"`
	MerchantOrderId string `json:"merchantOrderIds"`
	ResultCode      string `json:"resultCode"`
	Signature       string `json:"signature"`
}

package transaction

import (
	"bytes"
	"context"
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"
)

type DuitkuService struct {
	DuitkuKey             string
	DuitkuMerchantCode    string
	DuitkuExpiryPeriod    *int64
	BaseUrl               string
	CallbackUrl           string
	SandboxUrl            string
	BaseUrlGetTransaction string
	BaseUrlGetBalance     string
	HttpClient            *http.Client
}

func NewDuitkuService() *DuitkuService {
	return &DuitkuService{
		DuitkuKey:             "",
		DuitkuMerchantCode:    "",
		CallbackUrl:           "http://localhost:3000/api/transaction/callback",
		BaseUrl:               "https://passport.duitku.com/webapi/api/merchant/v2/inquiry",
		SandboxUrl:            "https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry",
		BaseUrlGetTransaction: "https://passport.duitku.com/webapi/api/merchant/transactionStatus",
		BaseUrlGetBalance:     "https://passport.duitku.com/webapi/api/disbursement/checkbalance",
		HttpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

func (s *DuitkuService) CreateTransaction(ctx context.Context, params *DuitkuCreateTransactionParams) (*DuitkuCreateTransactionResponse, error) {

	signature := s.generateSignature(params.MerchantOrderId, params.PaymentAmount)

	var callback_url string
	if params.CallbackUrl == "" {
		callback_url = s.CallbackUrl
	} else {
		callback_url = params.CallbackUrl
	}
	payload := map[string]interface{}{
		"merchantCode":    s.DuitkuMerchantCode,
		"paymentAmount":   params.PaymentAmount,
		"merchantOrderId": params.MerchantOrderId,
		"paymentMethod":   params.PaymentCode,
		"signature":       signature,
		"callbackUrl":     callback_url,
		"returnUrl":       params.ReturnUrl,
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return nil, nil
	}

	req, err := http.NewRequestWithContext(ctx, "POST", s.SandboxUrl, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, nil
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := s.HttpClient.Do(req)
	if err != nil {
		return nil, nil
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, nil
	}

	var duitkuResponse DuitkuCreateTransactionResponse
	if err := json.Unmarshal(body, &duitkuResponse); err != nil {
		return s.createErrorResponse(fmt.Sprintf("Failed to parse success response: %v", err)), nil
	}
	return &duitkuResponse, nil
}

func (s *DuitkuService) generateSignature(merchantOrderId string, paymentAmount int) string {

	signatureString := s.DuitkuMerchantCode + merchantOrderId + strconv.Itoa(paymentAmount) + s.DuitkuKey

	h := md5.New()
	h.Write([]byte(signatureString))
	return hex.EncodeToString(h.Sum(nil))
}

func (s *DuitkuService) createErrorResponse(errorMessage string) *DuitkuCreateTransactionResponse {
	return &DuitkuCreateTransactionResponse{
		Status:  "false",
		Message: errorMessage,
	}
}

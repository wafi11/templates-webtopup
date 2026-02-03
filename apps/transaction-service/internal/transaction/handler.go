package transaction

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/wafi1104/templates-webtopup/apps/transaction-service/pkg"
)

type Handler struct {
	svc Service
}

func NewHandler(svc Service) Handler {
	return Handler{svc: svc}
}

func (h *Handler) Create(c *gin.Context) {
	var request TransactionRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		pkg.ErrorResponse(c, http.StatusBadRequest, "Invalid Body Request", "Invalid Body Request")
		return
	}

	data, message, code := h.svc.Create(c, request, DefineRequest{
		UserAgent: c.Request.UserAgent(),
		IpAddress: c.ClientIP(),
	})

	if message != VALIDATION_SUCCESS {
		pkg.ErrorResponse(c, code.HTTPStatus(), string(message), string(message))
		return
	}

	pkg.SuccessResponse(c, code.HTTPStatus(), string(message), data)
}

func (h *Handler) FindInvoice(c *gin.Context) {
	invoiceId := c.Param("id")
	log.Print(invoiceId)
	trx, msg, code := h.svc.FindInvoice(c, invoiceId)

	if msg != VALIDATION_SUCCESS {
		pkg.ErrorResponse(c, code.HTTPStatus(), string(msg), string(msg))
		return
	}

	pkg.SuccessResponse(c, http.StatusOK, string(msg), trx)
}

// Helper function untuk get first non-empty string
func firstNonEmpty(values ...string) string {
	for _, v := range values {
		if v != "" {
			return v
		}
	}
	return ""
}

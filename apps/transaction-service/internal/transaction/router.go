package transaction

import (
	"database/sql"

	"github.com/gin-gonic/gin"
)

func TransactionRouter(db *sql.DB, r *gin.RouterGroup) {
	duitku := NewDuitkuService()
	repo := NewRepository(db, duitku)
	svc := NewService(repo)
	handler := NewHandler(svc)

	group := r.Group("/transaction")
	group.POST("", handler.Create)
	group.GET("/:id", handler.FindInvoice)

}

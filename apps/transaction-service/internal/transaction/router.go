package transaction

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/wafi1104/templates-webtopup/apps/transaction-service/internal/queue"
	"github.com/wafi1104/templates-webtopup/apps/transaction-service/pkg"
)

func TransactionRouter(db *sql.DB, r *gin.RouterGroup, cfg *pkg.Config, queue *queue.RabbitMQ) {
	duitku := NewDuitkuService(cfg)
	repo := NewRepository(db, duitku)
	svc := NewService(repo, queue)
	handler := NewHandler(*svc)

	group := r.Group("/transaction")
	group.POST("", handler.Create)
	group.GET("/:id", handler.FindInvoice)

}

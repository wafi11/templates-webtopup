package transaction

import (
	"context"

	"github.com/wafi1104/templates-webtopup/apps/transaction-service/internal/queue"
)

type Service struct {
	repo  Repository
	queue *queue.RabbitMQ
}

func NewService(repo Repository, queue *queue.RabbitMQ) *Service {
	return &Service{repo: repo, queue: queue}
}

func (s *Service) Create(c context.Context, req TransactionRequest, define DefineRequest) (*TransactionCreateResponse, MessageResponse, ErrorCode) {
	transactionId := generateRandomId()

	return s.repo.Create(c, req, define, transactionId)
}

func (s *Service) FindInvoice(c context.Context, invoiceId string) (*FindInvoice, MessageResponse, ErrorCode) {
	return s.repo.FindInvoice(c, invoiceId)
}

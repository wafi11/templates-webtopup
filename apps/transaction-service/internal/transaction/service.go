package transaction

import "context"

type Service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return Service{repo: repo}
}

func (s *Service) Create(c context.Context, req TransactionRequest, define DefineRequest) (*TransactionCreateResponse, MessageResponse, ErrorCode) {
	return s.repo.Create(c, req, define)
}

func (s *Service) FindInvoice(c context.Context, invoiceId string) (*FindInvoice, MessageResponse, ErrorCode) {
	return s.repo.FindInvoice(c, invoiceId)
}

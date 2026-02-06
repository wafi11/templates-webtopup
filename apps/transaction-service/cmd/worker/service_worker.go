package main

// import (
// 	"context"
// 	"encoding/json"
// 	"fmt"
// 	"log"

// 	"github.com/rabbitmq/amqp091-go"
// 	"github.com/wafi1104/templates-webtopup/apps/transaction-service/internal/queue"
// )

// type Service struct {
// 	repo  Repository
// 	queue *queue.RabbitMQ
// }

// func NewService(repo Repository, queue *queue.RabbitMQ) *Service {
// 	return &Service{repo: repo, queue: queue}
// }

// func (s *Service) Create(c context.Context, req TransactionRequest, define DefineRequest) (*TransactionCreateResponse, MessageResponse, ErrorCode) {
// 	transactionId := generateRandomId()

// 	// Publish ke queue
// 	code := s.publisherTransaction(c, transactionId, req, define)
// 	if code != CODE_VALIDATION_SUCCESS {
// 		return nil, TRANSACTION_CANCELLED, code
// 	}

// 	return &TransactionCreateResponse{
// 		ReferenceID: transactionId,
// 	}, VALIDATION_SUCCESS, code
// }

// func (s *Service) FindInvoice(c context.Context, invoiceId string) (*FindInvoice, MessageResponse, ErrorCode) {
// 	return s.repo.FindInvoice(c, invoiceId)
// }

// // ========== PUBLISHER ==========
// func (s *Service) publisherTransaction(ctx context.Context, trxid string, req TransactionRequest, define DefineRequest) ErrorCode {
// 	queueName := "transaction_queue" // ← gunakan 1 queue saja (lebih simple)

// 	// Declare queue
// 	_, err := s.queue.Channel.QueueDeclare(
// 		queueName, // name
// 		true,      // durable
// 		false,     // delete when unused
// 		false,     // exclusive
// 		false,     // no-wait
// 		nil,       // arguments
// 	)
// 	if err != nil {
// 		log.Printf("Failed to declare queue: %s", err)
// 		return CODE_TRANSACTION_CANCELLED
// 	}

// 	// Buat transaction order
// 	order := TransactionOrder{
// 		TransactionId:      trxid,
// 		TransactionRequest: req,
// 		DefineRequest:      define,
// 	}

// 	body, err := json.Marshal(order)
// 	if err != nil {
// 		log.Printf("Failed to marshal message: %v", err)
// 		return CODE_TRANSACTION_CANCELLED
// 	}

// 	// Publish message
// 	err = s.queue.Channel.Publish(
// 		"",        // exchange
// 		queueName, // routing key
// 		false,     // mandatory
// 		false,     // immediate
// 		amqp091.Publishing{
// 			ContentType:  "application/json",
// 			Body:         body,
// 			DeliveryMode: amqp091.Persistent,
// 		},
// 	)

// 	if err != nil {
// 		log.Printf("Failed to publish message: %v", err)
// 		return CODE_TRANSACTION_CANCELLED
// 	}

// 	log.Printf("✅ Transaction %s published to queue", trxid)
// 	return CODE_VALIDATION_SUCCESS
// }

// // ========== CONSUMER (WORKER) ==========
// func (s *Service) StartWorker(ctx context.Context) error {
// 	queueName := "transaction_queue"

// 	// Declare queue
// 	_, err := s.queue.Channel.QueueDeclare(
// 		queueName,
// 		true,  // durable
// 		false, // delete when unused
// 		false, // exclusive
// 		false, // no-wait
// 		nil,   // arguments
// 	)
// 	if err != nil {
// 		return fmt.Errorf("failed to declare queue: %w", err)
// 	}

// 	// Set QoS (process 1 message at a time)
// 	err = s.queue.Channel.Qos(
// 		1,     // prefetch count
// 		0,     // prefetch size
// 		false, // global
// 	)
// 	if err != nil {
// 		return fmt.Errorf("failed to set QoS: %w", err)
// 	}

// 	// Start consuming
// 	msgs, err := s.queue.Channel.Consume(
// 		queueName,
// 		"",    // consumer tag
// 		false, // auto-ack
// 		false, // exclusive
// 		false, // no-local
// 		false, // no-wait
// 		nil,   // args
// 	)
// 	if err != nil {
// 		return fmt.Errorf("failed to consume: %w", err)
// 	}

// 	log.Println("🚀 Transaction worker started. Waiting for messages...")

// 	// Process messages
// 	for {
// 		select {
// 		case <-ctx.Done():
// 			log.Println("⏹️  Worker stopped")
// 			return nil

// 		case msg, ok := <-msgs:
// 			if !ok {
// 				return fmt.Errorf("message channel closed")
// 			}

// 			// Process message
// 			s.handleMessage(ctx, msg)
// 		}
// 	}
// }

// // ========== MESSAGE HANDLER ==========
// func (s *Service) handleMessage(ctx context.Context, msg amqp091.Delivery) {
// 	var order TransactionOrder

// 	// Unmarshal message
// 	if err := json.Unmarshal(msg.Body, &order); err != nil {
// 		log.Printf("❌ Failed to unmarshal message: %v", err)
// 		msg.Nack(false, false) // reject, don't requeue
// 		return
// 	}

// 	log.Printf("📥 Processing transaction: %s", order.TransactionId)

// 	// Process transaction (simpan ke database)
// 	_, _, code := s.repo.Create(ctx, order.TransactionRequest, order.DefineRequest, order.TransactionId)

// 	if code != CODE_VALIDATION_SUCCESS {
// 		log.Printf("❌ Failed to process transaction %s, code: %v", order.TransactionId, code)

// 		// Retry (requeue) jika error
// 		msg.Nack(false, true)
// 		return
// 	}

// 	// Success - acknowledge message
// 	msg.Ack(false)
// 	log.Printf("✅ Transaction %s processed successfully", order.TransactionId)
// }

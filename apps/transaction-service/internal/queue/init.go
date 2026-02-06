package queue

import (
	"fmt"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/wafi1104/templates-webtopup/apps/transaction-service/pkg"
)

type RabbitMQ struct {
	Conn    *amqp.Connection
	Channel *amqp.Channel
}

func NewConnQueue(cfg *pkg.Config) (*RabbitMQ, error) {
	// Connect to RabbitMQ
	conn, err := amqp.Dial(cfg.MessageBrokerEndpoint)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}

	// Open channel
	ch, err := conn.Channel()
	if err != nil {
		conn.Close() // Tutup connection jika gagal buat channel
		return nil, fmt.Errorf("failed to open channel: %w", err)
	}

	log.Println("✅ Successfully connected to RabbitMQ")

	return &RabbitMQ{
		Conn:    conn,
		Channel: ch,
	}, nil
}

// Method untuk close connection (dipanggil saat shutdown app)
func (r *RabbitMQ) Close() error {
	if r.Channel != nil {
		if err := r.Channel.Close(); err != nil {
			return err
		}
	}
	if r.Conn != nil {
		if err := r.Conn.Close(); err != nil {
			return err
		}
	}
	log.Println("RabbitMQ connection closed")
	return nil
}

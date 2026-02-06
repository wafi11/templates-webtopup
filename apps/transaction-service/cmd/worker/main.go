package main

// import (
// 	"context"
// 	"log"
// 	"os"
// 	"os/signal"
// 	"syscall"
// 	"time"

// 	"github.com/wafi1104/templates-webtopup/apps/transaction-service/internal/queue"
// 	"github.com/wafi1104/templates-webtopup/apps/transaction-service/internal/transaction"
// 	"github.com/wafi1104/templates-webtopup/apps/transaction-service/pkg"
// )

// func main() {
// 	// Load config

// 	db, err := pkg.NewDatabaseConnection(pkg.DatabaseConfig{
// 		Host:            "localhost",
// 		Port:            "5433",
// 		Username:        "postgres",
// 		Password:        "password",
// 		DBName:          "template_web_topup",
// 		SSLMode:         "disable",
// 		Timezone:        "Asia/Jakarta",
// 		MaxIdleConns:    10,
// 		MaxOpenConns:    100,
// 		ConnMaxLifetime: time.Hour,
// 		ConnMaxIdleTime: 10 * time.Minute,
// 		MigrationPath:   "internal/infrastructure/database/postgres/migrations",
// 	})

// 	if err != nil {
// 		log.Fatalf("database error : %s", err.Error())
// 	}

// 	defer db.Close()

// 	// Connect to RabbitMQ
// 	rabbitMQ, err := queue.NewConnQueue(&pkg.Config{
// 		MessageBrokerEndpoint: "amqp://admin:admin123@localhost:5672",
// 	})
// 	if err != nil {
// 		log.Fatal("Failed to connect to RabbitMQ:", err)
// 	}
// 	defer rabbitMQ.Close()

// 	// Initialize service
// 	duitkuSvc := transaction.NewDuitkuService(&pkg.Config{
// 		DuitkuKey: "",
// 	})
// 	repo := transaction.NewRepository(db.SqlDB, duitkuSvc)
// 	svc := transaction.NewService(repo, rabbitMQ)

// 	// Create context for graceful shutdown
// 	ctx, cancel := context.WithCancel(context.Background())
// 	defer cancel()

// 	// Start worker in goroutine
// 	go func() {
// 		if err := svc.StartWorker(ctx); err != nil {
// 			log.Printf("Worker error: %v", err)
// 		}
// 	}()

// 	// Start API server (jika ada)
// 	// go startAPIServer(svc)

// 	// Wait for interrupt signal
// 	sigChan := make(chan os.Signal, 1)
// 	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

// 	log.Println("Application is running. Press Ctrl+C to exit.")
// 	<-sigChan

// 	log.Println("Shutting down gracefully...")
// 	cancel() // Stop worker
// }

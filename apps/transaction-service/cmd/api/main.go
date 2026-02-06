package main

import (
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/wafi1104/templates-webtopup/apps/transaction-service/internal/queue"
	"github.com/wafi1104/templates-webtopup/apps/transaction-service/internal/transaction"
	"github.com/wafi1104/templates-webtopup/apps/transaction-service/pkg"
)

func main() {
	cfg := pkg.NewConfig()
	db, err := pkg.NewDatabaseConnection(pkg.DatabaseConfig{
		Host:            cfg.DB_HOST,
		Port:            cfg.DB_PORT,
		Username:        cfg.DB_USERNAME,
		Password:        cfg.DB_PASSWORD,
		DBName:          cfg.DB_NAME,
		SSLMode:         "disable",
		Timezone:        "Asia/Jakarta",
		MaxIdleConns:    10,
		MaxOpenConns:    100,
		ConnMaxLifetime: time.Hour,
		ConnMaxIdleTime: 10 * time.Minute,
		MigrationPath:   "internal/infrastructure/database/postgres/migrations",
	})

	if err != nil {
		log.Fatalf("database error : %s", err.Error())
	}

	defer db.Close()

	queue, err := queue.NewConnQueue(cfg)

	if err != nil {
		log.Fatalf("message broker error : %s", err.Error())
	}
	defer queue.Close()
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Origin", "Authorization"},
		AllowCredentials: true,
	}))

	r.GET("/health", func(c *gin.Context) {
		health := db.HealthCheck(c.Request.Context())
		if health.Status == "unhealthy" {
			c.JSON(500, health)
			return
		}
		c.JSON(200, health)
	})

	api := r.Group("/api")
	transaction.TransactionRouter(db.SqlDB, api, cfg, queue)

	log.Println("Server running on :7000")
	if err := r.Run(":7000"); err != nil {
		log.Fatalf("failed to start server: %s", err.Error())
	}
}

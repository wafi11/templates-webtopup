package main

import (
	"context"
	"time"

	"github.com/wafi1104/templates-webtopup/apps/transaction-service/internal/products"
	"github.com/wafi1104/templates-webtopup/apps/transaction-service/pkg"
)

func main() {
	db, _ := pkg.NewDatabaseConnection(pkg.DatabaseConfig{
		Host:            "localhost",
		Port:            "5433",
		Username:        "postgres",
		Password:        "password",
		DBName:          "template_web_topup",
		SSLMode:         "disable",
		Timezone:        "Asia/Jakarta",
		MaxIdleConns:    10,
		MaxOpenConns:    100,
		ConnMaxLifetime: time.Hour,
		ConnMaxIdleTime: 10 * time.Minute,
		MigrationPath:   "internal/infrastructure/database/postgres/migrations",
	})
	digiSvc := products.NewDigiflazz()
	svc := products.NewProductService(db.SqlDB, digiSvc)
	svc.GenerateProducts(context.Background())
}

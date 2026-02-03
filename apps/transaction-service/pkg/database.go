package pkg

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
)

type DatabaseConnection struct {
	SqlDB  *sql.DB
	Config DatabaseConfig
}

func NewDatabaseConnection(config DatabaseConfig) (*DatabaseConnection, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s TimeZone=%s",
		config.Host,
		config.Port,
		config.Username,
		config.Password,
		config.DBName,
		config.SSLMode,
		config.Timezone,
	)

	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Configure connection pool
	db.SetMaxIdleConns(config.MaxIdleConns)
	db.SetMaxOpenConns(config.MaxOpenConns)
	db.SetConnMaxLifetime(config.ConnMaxLifetime)
	db.SetConnMaxIdleTime(config.ConnMaxIdleTime)

	// Test connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}
	fmt.Printf("CONNECT DB POSTGRES\n")
	return &DatabaseConnection{
		SqlDB:  db,
		Config: config,
	}, nil
}

func (dc *DatabaseConnection) Close() error {
	if dc.SqlDB != nil {
		return dc.SqlDB.Close()
	}
	return nil
}

// Health checks database health
func (dc *DatabaseConnection) Health(ctx context.Context) error {
	return dc.SqlDB.PingContext(ctx)
}

func (dc *DatabaseConnection) GetConnectionStats() sql.DBStats {
	return dc.SqlDB.Stats()
}

type DatabaseHealthCheck struct {
	Status      string        `json:"status"`
	Message     string        `json:"message"`
	Latency     time.Duration `json:"latency"`
	Connections sql.DBStats   `json:"connections"`
}

func (dc *DatabaseConnection) HealthCheck(ctx context.Context) *DatabaseHealthCheck {
	start := time.Now()

	healthCheck := &DatabaseHealthCheck{
		Connections: dc.GetConnectionStats(),
	}

	if err := dc.Health(ctx); err != nil {
		healthCheck.Status = "unhealthy"
		healthCheck.Message = fmt.Sprintf("Database connection failed: %v", err)
		healthCheck.Latency = time.Since(start)
		return healthCheck
	}

	healthCheck.Status = "healthy"
	healthCheck.Message = "Database is accessible"
	healthCheck.Latency = time.Since(start)

	return healthCheck
}

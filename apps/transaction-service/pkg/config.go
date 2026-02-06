package pkg

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DuitkuKey             string
	DuitkuUsername        string
	MessageBrokerEndpoint string
	DB_HOST               string
	DB_USERNAME           string
	DB_PORT               string
	DB_PASSWORD           string
	DB_NAME               string
	RedisURL              string
	Port                  string
}

func NewConfig() *Config {
	// Load .env file from root
	if err := godotenv.Load(".env"); err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	return &Config{
		DuitkuKey:             getEnv("DUITKU_KEY", ""),
		DuitkuUsername:        getEnv("DUITKU_USERNAME", ""),
		MessageBrokerEndpoint: getEnv("MESSAGE_BROKER_ENDPOINT", "amqp://admin:admin123@localhost:5672"),
		DB_HOST:               getEnv("DB_HOST", "localhost"),
		DB_USERNAME:           getEnv("DB_USERNAME", "postgres"),
		DB_PORT:               getEnv("DB_PORT", "5433"),
		DB_PASSWORD:           getEnv("DB_PASSWORD", "password"),
		DB_NAME:               getEnv("DB_NAME", "template_web_topup"),
		RedisURL:              getEnv("REDIS_URL", "localhost:6379"),
		Port:                  getEnv("PORT", "8080"),
	}
}

// Helper function to get env with default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

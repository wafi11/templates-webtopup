package pkg

import (
	"time"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Success    bool        `json:"success"`
	Message    string      `json:"message"`
	StatusCode int         `json:"statusCode"`
	Timestamp  string      `json:"timestamp"`
	Data       interface{} `json:"data,omitempty"`
	Error      string      `json:"error,omitempty"`
}

func SuccessResponse(c *gin.Context, statusCode int, message string, data interface{}) {
	response := Response{
		Success:    true,
		Message:    message,
		StatusCode: statusCode,
		Timestamp:  time.Now().Format(time.RFC3339),
		Data:       data,
	}
	c.JSON(statusCode, response)
}

func ErrorResponse(c *gin.Context, statusCode int, message string, err string) {
	response := Response{
		Success:    false,
		Message:    message,
		StatusCode: statusCode,
		Timestamp:  time.Now().Format(time.RFC3339),
		Error:      err,
	}
	c.JSON(statusCode, response)
}

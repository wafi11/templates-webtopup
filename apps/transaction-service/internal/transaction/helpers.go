package transaction

import (
	"crypto/rand"
	"math/big"
	"time"
)

const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

func generateRandomId() string {
	// Timestamp dalam milliseconds
	timestamp := time.Now().UnixMilli()

	// Generate random number
	randomNum, _ := rand.Int(rand.Reader, big.NewInt(999999))

	// Combine timestamp + random
	combined := timestamp*1000000 + randomNum.Int64()

	// Convert to base62
	encoded := toBase62(combined)

	// Format: WFDN + encoded
	// Contoh: WFDNa3K8mP2xR5
	return "WFDN" + encoded
}

func toBase62(num int64) string {
	if num == 0 {
		return "0"
	}

	result := ""
	for num > 0 {
		result = string(base62Chars[num%62]) + result
		num /= 62
	}
	return result
}

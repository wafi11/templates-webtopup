package pkg

import "math"

type Calculation struct {
	MarginAmount     int64
	MarginPercentage float64
	CalculationType  CalculationType
}

type TotalCalculation struct {
	TotalAmount int64
	TotalFee    int64
}

type CalculationType string

const (
	HYBRID     CalculationType = "HYBRID"
	PERCENTAGE CalculationType = "PERCENTAGE"
	FIXED      CalculationType = "FIXED"
)

func CalculationFees(calc Calculation, price int64) TotalCalculation {
	var total TotalCalculation

	switch calc.CalculationType {
	case FIXED:
		total.TotalFee = calc.MarginAmount
		total.TotalAmount = price + calc.MarginAmount

	case PERCENTAGE:
		// Hitung fee berdasarkan persentase dari price
		total.TotalFee = int64(math.Round(float64(price) * calc.MarginPercentage / 100))
		total.TotalAmount = price + total.TotalFee

	case HYBRID:
		// Fixed amount + persentase dari price
		percentageFee := int64(math.Round(float64(price) * calc.MarginPercentage / 100))
		total.TotalFee = calc.MarginAmount + percentageFee
		total.TotalAmount = price + total.TotalFee
	}

	return total
}

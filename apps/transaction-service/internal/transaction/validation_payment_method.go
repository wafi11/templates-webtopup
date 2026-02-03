package transaction

import (
	"context"

	"github.com/wafi1104/templates-webtopup/apps/transaction-service/pkg"
)

type ValidationPaymentMethod struct {
	TotalTax      int64
	PaymentMethod string
	TotalAmount   int64
}

func (r *Repository) validationPaymentMethod(c context.Context, price int64, payment_code string) (*ValidationPaymentMethod, MessageResponse, ErrorCode) {
	var calc pkg.Calculation
	var method string
	query := `
		SELECT 
			method,
			margin_amount,
			margin_percentage,
			calculation_type 
		FROM payment_methods 
		WHERE code = $1 
	`
	err := r.db.QueryRowContext(c, query, payment_code).Scan(&method, &calc.MarginAmount, &calc.MarginPercentage, &calc.CalculationType)
	if err != nil {
		return nil, PAYMENT_CODE_NOT_FOUND, CODE_PAYMENT_CODE_NOT_FOUND
	}

	calculation := pkg.CalculationFees(calc, price)

	return &ValidationPaymentMethod{
		PaymentMethod: method,
		TotalTax:      calculation.TotalFee,
		TotalAmount:   calculation.TotalAmount,
	}, VALIDATION_SUCCESS, CODE_VALIDATION_SUCCESS

}

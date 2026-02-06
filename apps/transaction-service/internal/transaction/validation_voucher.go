package transaction

import (
	"context"
	"database/sql"
	"errors"
	"log"

	"github.com/wafi1104/templates-webtopup/apps/transaction-service/pkg"
)

type ValidationVoucherReturn struct {
	ErrorCode     ErrorCode
	TotalAmount   int64
	TotalDiscount int64
}

func (r *Repository) validationVoucher(c context.Context, tx *sql.Tx, vc string, price int64) *ValidationVoucherReturn {
	var calc pkg.Calculation

	// ❌ MISSING: FROM clause!
	query := `
		SELECT
			calculation_type,
			margin_amount,
			margin_percentage
		FROM vouchers  
		WHERE code = $1
		AND DATE(started_at) <= CURRENT_DATE 
		AND DATE(end_at) >= CURRENT_DATE
		AND current_usage < max_usage
	`

	err := tx.QueryRowContext(c, query, vc).Scan(
		&calc.CalculationType,
		&calc.MarginAmount,
		&calc.MarginPercentage,
	)

	if err != nil {
		// ❌ KURANG SPESIFIK: perlu bedakan error
		if errors.Is(err, sql.ErrNoRows) {
			return &ValidationVoucherReturn{
				ErrorCode: CODE_VOUCHER_INVALID,
			}
		}
		return &ValidationVoucherReturn{
			ErrorCode: CODE_DATABASE_ERROR,
		}
	}

	// calculation price
	pricing := pkg.CalculationFees(calc, price)
	log.Printf("price : %d", price)
	log.Printf("discount : %d", pricing.TotalFee)
	log.Printf("total : %d", pricing.TotalAmount)

	return &ValidationVoucherReturn{
		ErrorCode:     CODE_VALIDATION_SUCCESS,
		TotalAmount:   price - pricing.TotalFee,
		TotalDiscount: pricing.TotalFee,
	}
}

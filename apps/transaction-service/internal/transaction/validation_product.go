package transaction

import (
	"context"
	"database/sql"
	"errors"
	"log"
)

func (r *Repository) validationProduct(ctx context.Context, productCode string, tx *sql.Tx) (*ProductValidation, MessageResponse, ErrorCode) {
	var product ProductValidation

	query := `
		SELECT 
			pi.name,
			pi.base_price, 
			pi.discount_price, 
			pi.is_active,
			pi.stock
		FROM product_items pi
		WHERE pi.code = $1
	`

	err := tx.QueryRowContext(ctx, query, productCode).Scan(
		&product.ProductName,
		&product.BasePrice,
		&product.DiscountPrice,
		&product.IsActive,
		&product.ProductStock,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			log.Printf("product not found: %s", productCode)
			return nil, PRODUCT_NOT_FOUND, CODE_PRODUCT_NOT_FOUND
		}
		log.Printf("failed to query product: %v", err)
		return nil, INTERNAL_SERVER_ERROR, CODE_INTERNAL_SERVER_ERROR
	}

	if !product.IsActive {
		return nil, PRODUCT_INACTIVE, CODE_PRODUCT_INACTIVE
	}

	if product.ProductStock <= 0 {
		return nil, PRODUCT_OUT_OF_STOCK, CODE_PRODUCT_OUT_OF_STOCK
	}

	return &product, VALIDATION_SUCCESS, CODE_VALIDATION_SUCCESS
}

package products

import (
	"context"
	"database/sql"
	"fmt"
	"log"
)

type ProductService struct {
	db          *sql.DB
	digiService DigiflazzService
}

func NewProductService(db *sql.DB, digiService DigiflazzService) *ProductService {
	return &ProductService{
		db:          db,
		digiService: digiService,
	}
}

type ResultsUpsertProducts struct {
	ProductId int64
}

func (s *ProductService) upsertProducts(c context.Context, tx *sql.Tx, productBrand string) (*ResultsUpsertProducts, error) {
	var results ResultsUpsertProducts
	query := `
		SELECT id
		FROM products p
		WHERE LOWER(slug) = LOWER($1)
	`

	err := tx.QueryRowContext(c, query, productBrand).
		Scan(&results.ProductId)
	if err != nil {
		return nil, fmt.Errorf("product or category not found: %w", err)
	}

	return &results, nil
}
func (s *ProductService) CreateSubProduct(c context.Context, tx *sql.Tx, productId int64, producttype string) (int64, error) {
	var subProductId int64
	querySelect := `
		SELECT id FROM sub_products WHERE product_id = $1 AND code = $2
	`

	err := tx.QueryRowContext(c, querySelect, productId, producttype).Scan(&subProductId)
	if err != nil {
		query := `
			INSERT INTO sub_products (name, product_id, code, "order", is_active) 
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id
		`

		err := tx.QueryRowContext(c, query, producttype, productId, producttype, 1, true).Scan(&subProductId)
		if err != nil {
			return 0, fmt.Errorf("failed to create sub_products: %w", err)
		}
	}
	// If no error, record exists and subProductId is already populated

	return subProductId, nil
}
func (s *ProductService) UpsertProductItem(c context.Context, tx *sql.Tx, subProductId int64, productDigi ProductData) (int64, error) {
	var productItemId int64

	checkQuery := `
		SELECT id FROM product_items WHERE code = $1 AND sub_product_id = $2
	`

	err := tx.QueryRowContext(c, checkQuery, productDigi.BuyerSkuCode, subProductId).Scan(&productItemId)

	if err == sql.ErrNoRows {
		insertQuery := `
			INSERT INTO product_items (
				sub_product_id,
				base_price,
				name,
				code,
				is_active,
				"order",
				is_best_seller,
				stock
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			RETURNING id
		`

		err = tx.QueryRowContext(c, insertQuery,
			subProductId,
			productDigi.Price,
			productDigi.ProductName,
			productDigi.BuyerSkuCode,
			productDigi.BuyerProductStatus && productDigi.SellerProductStatus,
			1,
			false,
			-1,
		).Scan(&productItemId)

		if err != nil {
			return 0, fmt.Errorf("failed to create product_items: %w", err)
		}
	} else if err != nil {
		return 0, fmt.Errorf("failed to check product_items: %w", err)
	} else {
		updateQuery := `
			UPDATE product_items 
			SET base_price = $1,
				name = $2,
				is_active = $3
			WHERE id = $4
		`

		_, err = tx.ExecContext(c, updateQuery,
			productDigi.Price,
			productDigi.ProductName,
			productDigi.BuyerProductStatus && productDigi.SellerProductStatus,
			productItemId,
		)

		if err != nil {
			return 0, fmt.Errorf("failed to update product_items: %w", err)
		}
	}

	return productItemId, nil
}

func (s *ProductService) FindAllRoles(c context.Context, tx *sql.Tx) ([]int64, error) {
	query := `SELECT id FROM roles`

	rows, err := tx.QueryContext(c, query)
	if err != nil {
		return nil, fmt.Errorf("failed to find roles: %w", err)
	}
	defer rows.Close()

	var rolesId []int64
	for rows.Next() {
		var roleId int64
		if err := rows.Scan(&roleId); err != nil {
			return nil, fmt.Errorf("failed to scan role id: %w", err)
		}
		rolesId = append(rolesId, roleId)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating roles: %w", err)
	}

	return rolesId, nil
}

func (s *ProductService) UpsertProductItemRole(c context.Context, tx *sql.Tx, productItemId, roleId int64) error {
	query := `
		INSERT INTO product_items_roles (product_items_id, roles_id)
		VALUES ($1, $2)
		ON CONFLICT (product_items_id, roles_id) DO NOTHING
	`

	_, err := tx.ExecContext(c, query, productItemId, roleId)
	if err != nil {
		return fmt.Errorf("failed to upsert product_item_role: %w", err)
	}

	return nil
}

// Process single product item in its own transaction
func (s *ProductService) processProductItem(c context.Context, item ProductData, roles []int64) error {
	tx, err := s.db.BeginTx(c, nil)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// 1. Find or get product info
	products, err := s.upsertProducts(c, tx, item.Brand)
	if err != nil {
		return err
	}

	var subProductId int64

	// 2. Create sub_product if not exists

	subProductId, err = s.CreateSubProduct(c, tx, products.ProductId, item.Type)
	if err != nil {
		return fmt.Errorf("failed to create sub_product: %w", err)
	}

	// 3. Upsert product_item
	productItemId, err := s.UpsertProductItem(c, tx, subProductId, item)
	if err != nil {
		return fmt.Errorf("failed to upsert product_item: %w", err)
	}

	// 4. Create product_item_roles for all roles
	for _, roleId := range roles {
		if err := s.UpsertProductItemRole(c, tx, productItemId, roleId); err != nil {
			return fmt.Errorf("failed to upsert product_item_role: %w", err)
		}
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func (s *ProductService) GenerateProducts(c context.Context) error {
	// Get product data from Digiflazz
	productDigi, err := s.digiService.CheckPrice(c)
	if err != nil {
		return fmt.Errorf("failed to get products from digiflazz: %w", err)
	}

	// Get all roles (outside transaction loop)
	tx, err := s.db.BeginTx(c, nil)
	if err != nil {
		return fmt.Errorf("failed to begin transaction for roles: %w", err)
	}

	roles, err := s.FindAllRoles(c, tx)
	tx.Rollback() // Just reading, so rollback is fine

	if err != nil {
		return fmt.Errorf("failed to find roles: %w", err)
	}

	// Track statistics
	successCount := 0
	failCount := 0
	var failedProducts []string

	// Process each product in separate transaction
	for _, item := range productDigi {
		if err := s.processProductItem(c, *item, roles); err != nil {
			failCount++
			failedProducts = append(failedProducts, fmt.Sprintf("%s (%s)", item.Brand, item.ProductName))
			log.Printf("failed to process product %s (%s): %v", item.Brand, item.ProductName, err)
			continue // Continue processing other products
		}
		successCount++
	}

	log.Printf("Product generation completed: %d succeeded, %d failed", successCount, failCount)
	if len(failedProducts) > 0 {
		log.Printf("Failed products: %v", failedProducts)
	}

	return nil
}

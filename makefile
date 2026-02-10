run-app:
	pnpm dev

run-trx:
	cd apps/transaction-service; air;

run-products:
	cd apps/transactions/cmd/test; go run main.go;
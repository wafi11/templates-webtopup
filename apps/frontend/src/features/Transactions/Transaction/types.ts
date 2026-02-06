export interface PropsItem {
  nickname?: string;
  gameId: string;
  zoneId?: string;
  product: string;
  item: string;
  payment: string;
}

export type CreateTransactionResponse = {
  referenceId: string;
};

export type MethodOrder = {
  calculation_type: string;
  fee_amount: number;
  fee_percentage: number;
  code: string;
  name: string;
};

export type OrderSubmit = {
  voucherCode?: string;
  paymentCode: string;
  productCode: string;
  quantity: number;
  destination: string;
  email?: string;
  phoneNumber: string;
};

export type ProductOrder = {
  code: string;
  name: string;
  price: number;
};

export type TransactionStatus =
  | "PENDING"
  | "PAID"
  | "PROCESS"
  | "SUCCESS"
  | "FAILED";

export type Invoice = {
  paymentMethod: string;
  paymentUrl: string;
  serialNumber: string | null;
  status: TransactionStatus;
  destination: string;
  price: number;
  quantity: number;
  amount: number;
  tax: number;
  total: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
  productName: string;
  productItemName: string;
  productImage: string;
};

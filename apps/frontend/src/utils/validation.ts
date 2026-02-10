import { OrderHooks } from "@/features/Transactions/Transaction/hooks/useOrder";
import { MethodOrder } from "@/features/Transactions/Transaction/types";
import { CALCULATION_TYPE } from "@repo/types";

// 1. Pisahkan business logic ke utils
export const OrderCalculator = {
  calculateTotal(price: number, quantity: number, method: MethodOrder): number {
    const subtotal = price * quantity;

    switch (method.calculation_type) {
      case CALCULATION_TYPE.PERCENTAGE:
        return subtotal * (1 + method.fee_percentage / 100);
      case CALCULATION_TYPE.FIXED:
        return subtotal + method.fee_amount;
      case CALCULATION_TYPE.HYBRID:
        return subtotal * (1 + method.fee_percentage / 100) + method.fee_amount;
      default:
        return subtotal;
    }
  },
};

// 2. Validation helper
export const OrderValidator = {
  isValid(order: Partial<OrderHooks>): boolean {
    return !!(
      order.gameId &&
      order.phoneNumber &&
      (order.product?.code as string)
    );
  },
};

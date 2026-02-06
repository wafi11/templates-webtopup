import { CALCULATION_TYPE } from "@repo/types";
import { create } from "zustand";
import { MethodOrder, ProductOrder } from "../types";

export type OrderHooks = {
  gameId: string;
  zoneId?: string;
  nickname?: string;
  product: ProductOrder;
  quantity: number;
  method: MethodOrder;
  total: number;
  email?: string;
  phoneNumber: string;
  openDialog: boolean;
  voucherCode?: string;
  // Setters
  setOpenDialog: (open: boolean) => void;
  setGameId: (gameId: string) => void;
  setZoneId: (zoneId: string) => void;
  setNickname: (nickname: string) => void;
  setProduct: (product: ProductOrder) => void;
  setQuantity: (quantity: number) => void;
  setMethod: (method: MethodOrder) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  clearData: () => void;
  setVoucherCode: (vc: string) => void;
};

const initialState = {
  gameId: "",
  openDialog: false,
  zoneId: "",
  nickname: undefined,
  voucherCode: "",
  product: {
    code: "",
    name: "",
    price: 0,
  },
  quantity: 1,
  method: {
    calculation_type: "",
    fee_amount: 0,
    fee_percentage: 0,
    code: "",
    name: "",
  },

  total: 0,
  email: undefined,
  phoneNumber: "",
};

export const useStoreOrder = create<OrderHooks>((set) => ({
  ...initialState,

  // Setters
  setGameId: (gameId) => set({ gameId }),
  setZoneId: (zoneId) => set({ zoneId }),
  setNickname: (nickname) => set({ nickname }),
  setProduct: (product) =>
    set((state) => ({
      product,
      total: product_total(product.price, state.quantity, state.method),
    })),
  setQuantity: (quantity) =>
    set((state) => ({
      quantity,
      total: product_total(state.product.price, quantity, state.method),
    })),
  setMethod: (method) =>
    set((state) => ({
      method,
      total: product_total(state.product.price, state.quantity, method),
    })),
  setEmail: (email) => set({ email }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  clearData: () => set(initialState),
  setOpenDialog: (open) => set({ openDialog: open }),
  setVoucherCode: (vc) => set({ voucherCode: vc }),
}));

function product_total(
  price: number,
  quantity: number,
  method: {
    calculation_type: string;
    fee_amount: number;
    fee_percentage: number;
  },
): number {
  const subtotal = price * quantity;

  switch (method.calculation_type) {
    case CALCULATION_TYPE.PERCENTAGE:
      return subtotal + subtotal * (method.fee_percentage / 100);
    case CALCULATION_TYPE.FIXED:
      return subtotal + method.fee_amount;
    case CALCULATION_TYPE.HYBRID:
      return (
        subtotal + method.fee_amount + subtotal * (method.fee_percentage / 100)
      );
    default:
      return subtotal;
  }
}

import { CALCULATION_TYPE } from "@repo/types";
import { create } from "zustand";
import { MethodOrder, ProductOrder } from "../types";
import { OrderCalculator } from "@/utils/validation";

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
      total: OrderCalculator.calculateTotal(
        product.price,
        state.quantity,
        state.method,
      ),
    })),
  setQuantity: (quantity) =>
    set((state) => ({
      quantity,
      total: OrderCalculator.calculateTotal(
        state.product.price,
        quantity,
        state.method,
      ),
    })),
  setMethod: (method) =>
    set((state) => ({
      method,
      total: OrderCalculator.calculateTotal(
        state.product.price,
        state.quantity,
        method,
      ),
    })),
  setEmail: (email) => set({ email }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  clearData: () => set(initialState),
  setOpenDialog: (open) => set({ openDialog: open }),
  setVoucherCode: (vc) => set({ voucherCode: vc }),
}));

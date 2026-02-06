import {
  PaymentMethod,
  RequestParams,
  RequestValidationPaymentMethod,
} from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CreatePaymentMethod,
  DeletePaymentMethod,
  FindAllPaymentMethod,
  UpdatePaymentMethod,
} from "./EndpointApi";

export function useCreatePaymentMethod() {
  return useMutation({
    mutationKey: ["payment-method"],
    mutationFn: (req: RequestValidationPaymentMethod) =>
      CreatePaymentMethod(req),
    onSuccess: (ctx) => {
      toast.success(ctx.message);
    },
    onError: (ctx) => {
      toast.error(ctx.message);
    },
  });
}

export function useFindPaymentMethod(params: RequestParams) {
  return useQuery({
    queryKey: ["payment-method", params],
    queryFn: () => FindAllPaymentMethod(params),
  });
}

export function useUpdatePaymentMethod() {
  return useMutation({
    mutationKey: ["payment-method-update"],
    mutationFn: (req: PaymentMethod) => UpdatePaymentMethod(req, req.id),
  });
}

export function useDeletePaymentMethod() {
  return useMutation({
    mutationKey: ["payment-method-delete"],
    mutationFn: (id: number) => DeletePaymentMethod(id),
  });
}

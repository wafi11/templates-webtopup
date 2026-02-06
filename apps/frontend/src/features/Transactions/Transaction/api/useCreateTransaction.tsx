import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ApiResponse } from "@/lib/types";
import { CreateTransactionResponse, OrderSubmit } from "../types";

const TRANSACTION_URL = process.env.NEXT_PUBLIC_TRANSACTION_URL;

export function useCreateTransaction() {
  return useMutation({
    mutationKey: ["transaction"],
    mutationFn: async (req: OrderSubmit) => {
      const request = await axios.post<ApiResponse<CreateTransactionResponse>>(
        `${TRANSACTION_URL}/transaction`,
        req,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return request.data;
    },
  });
}

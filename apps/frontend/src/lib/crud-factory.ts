// lib/crud-factory.ts
import { api } from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import { RequestParams } from "@repo/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Factory untuk generate CRUD endpoints
 */
export function createCrudEndpoints<T, TRequest = Partial<T>>(
  resource: string,
) {
  return {
    create: async (req: TRequest): Promise<ApiResponse<T>> => {
      const response = await api.post<ApiResponse<T>>(`/${resource}`, req);
      return response.data;
    },

    findAll: async (
      params: RequestParams,
      additionalParams?: Record<string, string | number>,
    ): Promise<ApiResponse<T[]>> => {
      const url = new URLSearchParams();
      url.append("limit", params.limit.toString());
      url.append("offset", params.offset.toString());
      if (params.search) {
        url.append("search", params.search);
      }

      // Tambahkan additional params
      if (additionalParams) {
        Object.entries(additionalParams).forEach(([key, value]) => {
          url.append(key, value.toString());
        });
      }

      const response = await api.get<ApiResponse<T[]>>(`/${resource}?${url}`);
      return response.data;
    },

    findOne: async (id: number | string): Promise<ApiResponse<T>> => {
      const response = await api.get<ApiResponse<T>>(`/${resource}/${id}`);
      return response.data;
    },

    update: async (id: number, req: TRequest): Promise<ApiResponse<T>> => {
      const response = await api.put<ApiResponse<T>>(`/${resource}/${id}`, req);
      return response.data;
    },

    delete: async (id: number): Promise<ApiResponse<T>> => {
      const response = await api.delete<ApiResponse<T>>(`/${resource}/${id}`);
      return response.data;
    },
  };
}

/**
 * Factory untuk generate CRUD hooks
 */
export function createCrudHooks<T, TRequest = Partial<T>>(
  resource: string,
  endpoints: ReturnType<typeof createCrudEndpoints<T, TRequest>>,
) {
  return {
    useCreate: () => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationKey: [resource, "create"],
        mutationFn: (req: TRequest) => endpoints.create(req),
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: [resource] });
          toast.success(data.message);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to create");
        },
      });
    },

    useFindAll: (
      params: RequestParams,
      additionalParams?: Record<string, string | number>,
      options?: Omit<UseQueryOptions<ApiResponse<T[]>>, "queryKey" | "queryFn">,
    ) => {
      return useQuery({
        queryKey: [resource, "list", params, additionalParams],
        queryFn: () => endpoints.findAll(params, additionalParams),
        ...options,
      });
    },

    useFindOne: (
      id?: number | string,
      options?: Omit<UseQueryOptions<ApiResponse<T>>, "queryKey" | "queryFn">,
    ) => {
      return useQuery({
        queryKey: [resource, "detail", id],
        queryFn: () => endpoints.findOne(id as string | number),
        enabled: !!id,
        ...options,
      });
    },

    useUpdate: () => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationKey: [resource, "update"],
        mutationFn: ({ id, data }: { id: number; data: TRequest }) =>
          endpoints.update(id, data),
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries({ queryKey: [resource] });
          toast.success(data.message);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to update");
        },
      });
    },

    useDelete: () => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationKey: [resource, "delete"],
        mutationFn: (id: number) => endpoints.delete(id),
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: [resource] });
          toast.success(data.message);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to delete");
        },
      });
    },
  };
}

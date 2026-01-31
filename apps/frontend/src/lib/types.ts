import { ReactNode } from "react";

export interface WithChildren {
  children: ReactNode;
}
export interface ErrorResponse {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  error?: string;
  message: string;
}

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data: T;
  message: string;
};

export type ApiPagination<T> = {
  data: {
    data: T;
    meta: PaginationResponse;
  };
};

export type PaginationResponse = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type CountResponse = {
  count: number;
};

export interface PaginationParams {
  limit?: string;
  page?: string;
}

export interface FilterAll extends PaginationParams {
  search?: string;
  type?: string;
  status?: string;
}

export interface FilterRequest {
  limit: string;
  page: string;
  search?: string;
  status?: string;
  brand?: string;
  sortOrder?: string;
  sortBy?: string;
}

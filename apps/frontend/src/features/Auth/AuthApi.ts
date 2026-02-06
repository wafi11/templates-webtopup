import { api } from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import { RegisterAuth } from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { User } from "./types";
import { useRouter } from "next/router";

export type loginRequest = Omit<RegisterAuth, "fullname">;

export async function registerApi(request: RegisterAuth) {
  const req = await api.post("/auth/register", request);
  return req.data;
}

export async function loginApi(params: loginRequest) {
  const request = await api.post<{ success: boolean }>("/auth/login", params);
  return request.data;
}

export async function logutApi() {
  const router = useRouter();
  const request = await api.post("/auth/logout");
  if (request.success) {
    router.push("/login");
  }
  return request.data;
}

export async function refreshToken() {
  const request = await api.post("/auth/refresh");
  return request.data;
}

export async function findMe(): Promise<User> {
  const req =
    await api.get<ApiResponse<{ success: boolean; user: User }>>("/auth/me");

  return req.data.data.user;
}

export function useRegister() {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: (req: RegisterAuth) => registerApi(req),
  });
}

export function useLogin() {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (req: loginRequest) => loginApi(req),
  });
}

export function useLogout() {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () => logutApi(),
  });
}

export function useGetProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => findMe(),
  });
}

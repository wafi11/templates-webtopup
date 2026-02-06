import { api } from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import { ResponseCheckNickname } from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";

type RequestCheckNickname = {
  game: string;
  gameId: string;
  server?: string;
};
export async function CheckNickname({
  game,
  gameId,
  server,
}: RequestCheckNickname): Promise<ResponseCheckNickname | null> {
  const url = new URLSearchParams();
  const req = {
    id: gameId,
    server: server,
    game,
  };
  const request = await api.post<ResponseCheckNickname | null>(
    `/check-nickname`,
    req,
  );
  return request.data;
}

export function useCheckNickname(req: RequestCheckNickname) {
  return useMutation({
    mutationKey: ["check-nickname", req],
    mutationFn: () => CheckNickname(req),
  });
}

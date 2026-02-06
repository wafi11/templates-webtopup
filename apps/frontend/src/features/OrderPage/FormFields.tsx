import { useDebounce } from "@/hooks/useDebounce";
import { SectionContainer } from "./SectionContainer";
import { useCheckNickname } from "@/hooks/useCheckNickname";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface FormFieldsContainerProps {
  gameId: string;
  productId: number;
  setGameId: (gameId: string) => void;
  zoneId?: string;
  setZoneId: (zoneId: string) => void;
}

export function FormFieldsContainer({
  gameId,
  setGameId,
  setZoneId,
  zoneId,
  productId,
}: FormFieldsContainerProps) {
  const debounceGameId = useDebounce(gameId, 500);

  const checknickname = useCheckNickname({
    game: productId.toString(),
    gameId: debounceGameId,
    server: zoneId,
  });

  // ✅ Gunakan useEffect untuk trigger mutation
  useEffect(() => {
    // Validasi: pastikan gameId terisi (dan zoneId jika required)
    if (debounceGameId && debounceGameId.trim() !== "") {
      // Jika server/zoneId wajib diisi, tambahkan validasi:
      // if (zoneId && zoneId.trim() !== "") {
      checknickname.mutate();
      // }
    }
  }, [debounceGameId, zoneId]); // Trigger ulang jika salah satu berubah

  return (
    <SectionContainer id={1} title="Masukkan Data Akun">
      <div className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 pb-2">
                <label
                  htmlFor="id"
                  className="block text-xs font-medium text-foreground"
                >
                  ID
                </label>
                <div className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-info h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                </div>
              </div>
              <div className="relative flex w-full items-center gap-2">
                <div className="flex w-full flex-col items-start">
                  <input
                    className="relative block h-9 w-full appearance-none rounded-lg border border-border bg-input px-3 text-xs text-foreground placeholder-muted-foreground/50
             focus:z-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-75"
                    type="text"
                    id="id"
                    name="id"
                    placeholder="Masukkan ID"
                    autoComplete="off"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 pb-2">
                <label
                  htmlFor="server"
                  className="block text-xs font-medium text-foreground"
                >
                  Server
                </label>
              </div>
              <div className="relative flex w-full items-center gap-2">
                <div className="flex w-full flex-col items-start">
                  <input
                    className="relative block h-9 w-full appearance-none rounded-lg border border-border bg-input px-3 text-xs text-foreground
                 placeholder-muted-foreground/50 focus:z-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary
                  disabled:cursor-not-allowed disabled:opacity-75"
                    type="text"
                    id="server"
                    name="server"
                    placeholder="Masukkan Server"
                    autoComplete="off"
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {checknickname.isPending && (
            <Loader2 className="text-xs text-muted-foreground animate-spin" />
          )}
          {checknickname.isError && (
            <p className="text-xs text-destructive">
              Gagal mengecek nickname. Silakan coba lagi.
            </p>
          )}
          {checknickname.isSuccess && checknickname.data && (
            <div className="bg-secondary w-full p-2 rounded-xl">
              <p className="text-xs text-green-600">
                Nickname: {checknickname.data.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}

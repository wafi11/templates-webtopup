import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useLogin } from "../AuthApi";

export function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const { mutate, isPending } = useLogin();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: () => {
          toast.error("invalid credentials");
        },
      },
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-8 px-4 py-20 md:w-[550px] md:px-20">
        <div className="mx-auto w-full max-w-md space-y-8 lg:mx-0">
          <div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Masuk
            </h2>
            <p className="mt-2 text-sm text-foreground">
              Masuk dengan akun yang telah Kamu daftarkan.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3 rounded-md shadow-sm">
              {/* Username field */}
              <div>
                <Label
                  htmlFor="username"
                  className="block text-xs font-medium text-foreground pb-2"
                >
                  Username
                </Label>
                <div className="flex w-full flex-col items-start">
                  <Input
                    className="relative block h-9 w-full appearance-none rounded-lg border border-border bg-input px-3 text-xs text-foreground placeholder-muted-foreground/50 focus:z-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-75"
                    type="email"
                    id="email"
                    autoComplete="email"
                    placeholder="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isPending}
                  />
                </div>
                <span className="text-xs text-destructive"></span>
              </div>

              {/* Password field */}
              <div>
                <Label
                  htmlFor="password"
                  className="block text-xs font-medium text-foreground pb-2"
                >
                  Kata sandi
                </Label>
                <div className="relative">
                  <div className="flex w-full flex-col items-start">
                    <Input
                      className="relative block h-9 w-full appearance-none rounded-lg border border-border bg-input px-3 pr-10 text-xs text-foreground placeholder-muted-foreground/50 focus:z-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-75"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      placeholder="Kata sandi"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isPending}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <span className="text-xs text-destructive"></span>
              </div>
            </div>

            {/* Remember me and forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer rounded border bg-background text-primary focus:ring-primary focus:ring-offset-background"
                  id="remember-me"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isPending}
                />
                <Label
                  htmlFor="remember-me"
                  className="block select-none text-sm text-foreground font-medium cursor-pointer"
                >
                  Ingat akun ku
                </Label>
              </div>
              <div className="text-sm">
                {/* <Link
                  className="font-medium text-primary hover:text-primary/75 outline-none transition-colors"
                  href="/forgot-password"
                >
                  Lupa kata sandi mu?
                </Link> */}
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                className="inline-flex items-center justify-center whitespace-nowrap transition-all rounded-lg shadow-sm text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 group relative w-full"
                type="submit"
                disabled={isPending || !email || !password}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-primary-foreground transition-colors" />
                </span>
                <span className="pl-6">
                  {isPending ? "Memproses..." : "Masuk"}
                </span>
              </button>
            </div>

            {/* Sign up link */}
            <div className="relative mt-6">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-foreground">
                  Belum memiliki akun?{" "}
                  {/* <Link
                    className="font-semibold text-primary hover:text-primary/90 transition-colors"
                    href="/id-id/sign-up"
                  >
                    Daftar
                  </Link> */}
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

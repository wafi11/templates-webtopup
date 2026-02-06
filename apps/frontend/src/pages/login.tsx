import { AuthContainer } from "@/features/Auth/AuthContainer";
import { LoginPage } from "@/features/Auth/pages/LoginPage";

export default function Page() {
  return (
    <AuthContainer>
      <LoginPage />
    </AuthContainer>
  );
}

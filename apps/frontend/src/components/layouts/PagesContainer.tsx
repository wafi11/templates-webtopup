import { ReactNode } from "react";
import { Header } from "./Header";
interface PagesContainerProps {
  withHeader: boolean;
  withFooter: boolean;
  children: ReactNode;
}
export function PagesContainer({
  children,
  withFooter,
  withHeader,
}: PagesContainerProps) {
  return (
    <>
      {withHeader && <Header />}
      <main className="relative bg-background">
        <div className="sr-only">
          <h1>WFDNSTORE</h1>
          <p>
            WFDNSTORE adalah tempat top up games yang aman, murah dan
            terpercaya. Proses cepat 1-3 Detik. Open 24 jam. Payment terlengkap.
            Jika ada kendala silahkan klik logo CS pada kanan bawah di website
            ini.
          </p>
        </div>
        {children}
      </main>
      {withFooter && (
        <footer className="flex min-h-16 p-4">
          <p className="w-full text-center text-muted-foreground">
            © {new Date().getFullYear()} Wafiuddin. All rights reserved
          </p>
        </footer>
      )}
    </>
  );
}

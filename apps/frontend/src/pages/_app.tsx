import { ReactQueryLayout } from "@/components/layouts/ReactQueryLayout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReactQueryLayout>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </ReactQueryLayout>
  );
}

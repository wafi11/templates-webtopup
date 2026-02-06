import { AuthDropdown } from "@/features/Auth/AuthDropdown";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "./Navbar";

export function Header() {
  return (
    <header className="sticky z-40 w-full flex-none bg-secondary/80 backdrop-blur duration-500 ease-in-out print:hidden top-0 mt-0">
      <div className="border-b border-border/20">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center justify-start">
            <Link href={"/"} className="outline:none">
              <span className="sr-only"></span>
              <Image
                src={
                  "https://res.cloudinary.com/dikf91ikq/image/upload/v1767678964/Gemini_Generated_Image_3p3vdl3p3vdl3p3v_byxy9b.png"
                }
                className="h-9 rounded-full w-auto lg:h-10"
                width={1000}
                height={1000}
                alt="Logo Image"
              />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            <div className="relative w-full hidden md:flex">
              <div className="relative w-full">
                <input
                  className="h-9 w-full rounded-lg border border-muted-foreground/10 bg-input/80 pl-9 text-sm placeholder:text-muted-foreground/75 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-75"
                  placeholder="Cari Game atau Voucher"
                />
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                <X className="absolute right-3 top-1/2 size-4 -translate-y-1/2" />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <AuthDropdown />
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </header>
  );
}

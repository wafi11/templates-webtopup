import { navItems } from "@/data/NavItems";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="container hidden h-10 w-full items-center justify-between border-b border-border/20 md:flex">
      <div className="flex h-full items-center gap-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative inline-flex h-full items-center gap-2 text-sm font-medium transition-colors group"
            >
              <Icon
                className={`size-4 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}
              />
              <span
                className={
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-primary"
                }
              >
                {item.label}
              </span>
              <div
                className={`absolute inset-x-0 bottom-0 h-[2px] bg-primary transition-all duration-300 ${
                  isActive
                    ? "opacity-100 scale-x-100"
                    : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                }`}
              ></div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

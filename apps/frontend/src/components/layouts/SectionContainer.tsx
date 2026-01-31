import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
}
export function SectionContainer({
  children,
  className,
}: SectionContainerProps) {
  return (
    <section
      className={cn(
        "relative flex items-center overflow-hidden  px-4 py-4 lg:min-h-[553.96px] lg:py-8",
        className,
      )}
    >
      {children}
    </section>
  );
}

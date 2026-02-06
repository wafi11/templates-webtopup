import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionContainerProps {
  id: number;
  children: ReactNode;
  className?: string;
  title: string;
}
export function SectionContainer({
  children,
  className,
  title,
  id,
}: SectionContainerProps) {
  return (
    <section
      id={id.toString()}
      className={cn(
        "relative scroll-mt-20 rounded-xl bg-secondary/50 shadow-2xl md:scroll-mt-[7.5rem]",
        className,
      )}
    >
      <div className="flex items-center overflow-hidden rounded-t-xl bg-secondary">
        <div className="flex h-10 w-10 items-center justify-center bg-primary font-semibold text-primary-foreground">
          {id}
        </div>
        <h2 className="px-4 py-2 text-sm/6 font-semibold text-card-foreground">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

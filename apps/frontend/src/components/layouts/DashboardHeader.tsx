import { ReactNode } from "react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}
export function DashboardHeader({
  title,
  children,
  description,
}: DashboardHeaderProps) {
  return (
    <section className="flex md:flex-row flex-col md:justify-between items-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{title}</h1>
        <p className="text-sm md:text-md lg:text-lg">{description}</p>
      </div>
      {children}
    </section>
  );
}

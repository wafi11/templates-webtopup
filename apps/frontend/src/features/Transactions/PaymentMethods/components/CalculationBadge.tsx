import { Badge } from "@/components/ui/badge";

export function CalculationBadge(type: string | null) {
  const variants: Record<string, "default" | "secondary" | "outline"> = {
    FIXED: "default",
    PERCENTAGE: "secondary",
    HYBRID: "outline",
  };

  return (
    <Badge variant={variants[type || ""] || "outline"}>{type || "N/A"}</Badge>
  );
}

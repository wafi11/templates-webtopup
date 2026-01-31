import { SIDEBAR_DATA, SidebarDataType } from "@/data/SidebarData";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "../ui/separator";

interface SidebarDashboardProps {
  open: boolean;
  onOpenChange: () => void;
}

export function SidebarDashboard({
  open,
  onOpenChange,
}: SidebarDashboardProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  const isActive = (link?: string) => {
    if (!link) return false;
    return pathname === link;
  };

  const isParentActive = (children?: SidebarDataType[]) => {
    if (!children || children.length === 0) return false;
    return children.some((child) => pathname === child.link);
  };

  const renderMenuItem = (item: SidebarDataType, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const isItemActive = isActive(item.link);
    const isParentItemActive = isParentActive(item.children);

    if (hasChildren) {
      return (
        <div key={item.name} className="w-full">
          <button
            onClick={() => toggleExpand(item.name)}
            className={cn(
              "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              "hover:bg-accent/50 hover:translate-x-0.5",
              "group relative",
              isParentItemActive &&
                "bg-primary/10 text-primary font-medium shadow-sm",
              level > 0 && "pl-9",
            )}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={cn(
                  "flex-shrink-0 transition-colors",
                  isParentItemActive && "text-primary",
                )}
              >
                {item.icon}
              </div>
              <span className="font-medium truncate text-sm">{item.name}</span>
            </div>
            <ChevronRight
              className={cn(
                "w-4 h-4 transition-transform duration-200 flex-shrink-0",
                isExpanded && "rotate-90",
                isParentItemActive && "text-primary",
              )}
            />
          </button>

          {isExpanded && (
            <div className="mt-1 space-y-0.5 ml-2 border-l-2 border-border/40 pl-2">
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        href={item.link || "#"}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
          "hover:bg-accent/50 hover:translate-x-0.5",
          "group relative overflow-hidden",
          isItemActive
            ? "bg-primary text-primary-foreground shadow-md font-medium"
            : "hover:text-foreground",
          level > 0 && "pl-9",
        )}
      >
        {/* Active Indicator */}
        {isItemActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground rounded-r-full" />
        )}

        <div
          className={cn(
            "flex-shrink-0 transition-colors",
            isItemActive && "text-primary-foreground",
          )}
        >
          {item.icon}
        </div>
        <span className="font-medium truncate text-sm">{item.name}</span>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-100%] group-hover:translate-x-[100%] duration-700" />
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={onOpenChange}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-gradient-to-b from-card to-card/95 border-r border-border/50 z-50 transition-transform duration-300 ease-in-out shadow-xl",
          "w-72 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Sidebar navigation"
      >
        {/* Header */}
        <div className="relative p-5 border-b border-border/50 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-bold text-xl">
                  G
                </span>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md -z-10" />
              </div>
              <div>
                <span className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  GameTopUp
                </span>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenChange}
              className="lg:hidden hover:bg-accent/50 rounded-lg"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>

        {/* Navigation */}
        <ScrollArea className="h-[calc(100vh-88px)]">
          <nav className="p-4 space-y-1.5">
            {SIDEBAR_DATA.map((item) => renderMenuItem(item))}
          </nav>

          {/* Bottom Decoration */}
          <div className="p-4 pb-6">
            <Separator className="mb-4" />
            <div className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                © 2024 GameTopUp
              </p>
              <p className="text-xs text-muted-foreground text-center mt-0.5">
                Version 1.0.0
              </p>
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onOpenChange}
        className={cn(
          "fixed top-4 left-4 z-30 lg:hidden shadow-lg border-2",
          "hover:shadow-xl hover:scale-105 transition-all duration-200",
          "bg-card/80 backdrop-blur-sm",
        )}
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </Button>
    </>
  );
}

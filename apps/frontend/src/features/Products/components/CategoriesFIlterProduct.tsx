"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useFindCategories } from "../api/CategoryApi";

interface CategoriesFilterProductProps {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  checkScroll: () => void;
  scroll: (direction: "left" | "right") => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  selectedCategory: number | null;
  setSelectedCategory: (id: number | null) => void;
}

export function CategoriesFilterProduct({
  canScrollLeft,
  canScrollRight,
  checkScroll,
  scroll,
  scrollContainerRef,
  selectedCategory,
  setSelectedCategory,
}: CategoriesFilterProductProps) {
  const { data, isLoading } = useFindCategories({
    limit: 10,
    offset: 0,
    search: null,
  });
  const categoriesData = data?.data ?? [];

  useEffect(() => {
    setTimeout(checkScroll, 100);
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categoriesData, checkScroll]);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full py-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-9 w-20 bg-secondary rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // No data
  if (!categoriesData || categoriesData.length === 0) {
    return (
      <div className="w-full py-4">
        <p className="text-sm text-muted-foreground">No categories available</p>
      </div>
    );
  }

  return (
    <div className="w-full py-2">
      <div className="flex items-center gap-2">
        {/* Tombol Kiri */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`h-9 w-9 shrink-0 rounded-full transition-all duration-300 ${
            canScrollLeft ? "flex" : "hidden lg:flex lg:opacity-30"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Container Scrollable */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex flex-1 items-center gap-2 overflow-x-auto scroll-smooth md:gap-3 hide-scrollbar"
        >
          {/* Button Semua */}
          <Button
            type="button"
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="shrink-0 rounded-full px-4 py-2 text-sm font-medium"
          >
            Semua
          </Button>

          {/* Category Buttons */}
          {categoriesData.map((item) => (
            <Button
              key={item.id}
              type="button"
              variant={selectedCategory === item.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(item.id)}
              className="shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap"
            >
              {item.name}
            </Button>
          ))}
        </div>

        {/* Tombol Kanan */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={`h-9 w-9 shrink-0 rounded-full transition-all duration-300 ${
            canScrollRight ? "flex" : "hidden lg:flex lg:opacity-30"
          }`}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

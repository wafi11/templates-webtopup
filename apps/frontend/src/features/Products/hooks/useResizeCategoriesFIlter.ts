import { useRef, useState } from "react";
import { useFilterProduct } from "./useFIlterProduct";

export function useResizeCategoryFilter() {
  const { category, setCategory } = useFilterProduct();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 1,
      );
    }
  };
  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    selectedCategory: category,
    setCanScrollLeft,
    setCanScrollRight,
    setSelectedCategory: setCategory,
    checkScroll,
    scroll,
  };
}

import { SectionContainer } from "@/components/layouts/SectionContainer";
import { CategoriesFilterProduct } from "../Products/components/CategoriesFIlterProduct";
import { useFindProducts } from "../Products/api/ProductApi";
import { ProductCard } from "../Products/components/ProductCard";
import { useResizeCategoryFilter } from "../Products/hooks/useResizeCategoriesFIlter";

export function ProductSection() {
  const {
    canScrollLeft,
    canScrollRight,
    checkScroll,
    scroll,
    scrollContainerRef,
    selectedCategory,
    setSelectedCategory,
  } = useResizeCategoryFilter();
  const { data } = useFindProducts(
    {
      limit: 20,
      offset: 0,
      search: "",
    },
    selectedCategory ?? 0,
  );
  const productData = data?.data ?? [];

  return (
    <SectionContainer className="container lg:min-h-0 flex flex-col gap-4">
      {/* filter */}
      <CategoriesFilterProduct
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
        checkScroll={checkScroll}
        scroll={scroll}
        scrollContainerRef={scrollContainerRef}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Grid dengan gap yang lebih baik */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 w-full">
        {productData.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </SectionContainer>
  );
}

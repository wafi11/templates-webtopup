import { SectionContainer } from "@/components/layouts/SectionContainer";
import { CategoriesFilterProduct } from "../Products/components/CategoriesFIlterProduct";
import { useFindProducts } from "../Products/api/ProductApi";
import { ProductCard } from "../Products/components/ProductCard";

export function ProductSection() {
  const { data } = useFindProducts({
    limit: 10,
    offset: 0,
    search: "",
  });
  const productData = data?.data ?? [];

  return (
    <SectionContainer className="container lg:min-h-0 flex flex-col gap-4">
      {/* filter */}
      <CategoriesFilterProduct />

      {/* Grid dengan gap yang lebih baik */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 w-full">
        {productData.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </SectionContainer>
  );
}

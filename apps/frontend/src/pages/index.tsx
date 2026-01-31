import { PagesContainer } from "@/components/layouts/PagesContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { BannerSection } from "@/features/HomePage/BannerSection";
import { PopularSection } from "@/features/HomePage/PopularSection";
import { ProductSection } from "@/features/HomePage/ProductSection";

export default function Home() {
  return (
    <PagesContainer withHeader={true} withFooter={true}>
      <BannerSection />
      <PopularSection />
      <ProductSection />
    </PagesContainer>
  );
}

import { PagesContainer } from "@/components/layouts/PagesContainer";
import { useGetProfile } from "@/features/Auth/AuthApi";
import { BannerSection } from "@/features/HomePage/BannerSection";
import { PopularSection } from "@/features/HomePage/PopularSection";
import { ProductSection } from "@/features/HomePage/ProductSection";

export default function Home() {
  const { data } = useGetProfile();
  console.log(data);
  return (
    <PagesContainer withHeader={true} withFooter={true}>
      <BannerSection />
      <PopularSection />
      <ProductSection />
    </PagesContainer>
  );
}

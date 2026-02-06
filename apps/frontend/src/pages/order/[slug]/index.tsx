import { PagesContainer } from "@/components/layouts/PagesContainer";
import { BannerOrderImage } from "@/features/OrderPage/BannerPage";
import { OrderContainer } from "@/features/OrderPage/OrderContainer";
import { SectionDetailsOrderProduct } from "@/features/OrderPage/SectionDetailsProduct";
import { ApiResponse } from "@/lib/types";
import { Product } from "@repo/types";
import axios from "axios";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

interface OrderPageProps {
  product: Product | null;
  error?: string;
}

export default function OrderPage({
  product,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (error) {
    return (
      <PagesContainer withHeader={true} withFooter={true}>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive">Error</h2>
            <p className="mt-2 text-muted-foreground">{error}</p>
          </div>
        </div>
      </PagesContainer>
    );
  }

  if (!product) {
    return (
      <PagesContainer withHeader={true} withFooter={true}>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Product Not Found</p>
        </div>
      </PagesContainer>
    );
  }

  return (
    <PagesContainer withHeader={true} withFooter={true}>
      <BannerOrderImage
        image={product.banner_image as string}
        title={product.name}
      />
      <SectionDetailsOrderProduct
        image={product.thumbnail as string}
        name={product.name}
        subName={product.sub_name as string}
      />
      <OrderContainer
        productId={product.id}
        productImage={product.thumbnail as string}
        productName={product.name}
      />
    </PagesContainer>
  );
}

export const getServerSideProps = (async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    const res = await axios.get<ApiResponse<Product>>(
      `http://localhost:5000/api/product/${slug}`,
      {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.data.data) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        product: res.data.data,
      },
    };
  } catch (error) {
    // Handle different error cases
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return {
          notFound: true,
        };
      }

      return {
        props: {
          product: null,
          error: error.response?.data?.message || "Failed to load category",
        },
      };
    }

    return {
      props: {
        product: null,
        error: "An unexpected error occurred",
      },
    };
  }
}) satisfies GetServerSideProps<OrderPageProps>;

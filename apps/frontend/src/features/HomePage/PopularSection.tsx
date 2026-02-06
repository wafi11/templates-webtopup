import { SectionContainer } from "@/components/layouts/SectionContainer";
import { useFindProducts } from "../Products/api/ProductApi";
import Link from "next/link";
import Image from "next/image";

export function PopularSection() {
  const data = useFindProducts({
    limit: 10,
    offset: 0,
    search: null,
  });
  return (
    <SectionContainer className="flex flex-col gap-y-8 pt-8 lg:min-h-[0]">
      <div className="container">
        {/* TITLE */}
        <div className="mb-5 text-foreground">
          <h3 className="text-lg font-semibold uppercase leading-relaxed tracking-wider">
            🔥 POPULER SEKARANG!
          </h3>
          <p className="pl-6 text-xs">
            Berikut adalah beberapa produk yang paling populer saat ini.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {data.data?.data.map((item) => (
            <li
              key={item.id}
              className="group/product-card relative z-0 [--card-padding:theme(spacing.2)] [--card-radius:theme(borderRadius.2xl)]"
            >
              <Link
                href={`/order/${item.slug?.toLowerCase().replaceAll(" ", "-")}`}
                className="flex items-center gap-x-2 rounded-[--card-radius] bg-muted text-foreground duration-300 ease-in-out hover:shadow-2xl hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background md:gap-x-3 bg-title-product bg-popular-background text-popular-foreground"
              >
                <div className="flex items-center gap-3 p-[--card-padding]">
                  <Image
                    alt="thumbnail image"
                    width={100}
                    height={100}
                    src={
                      item.thumbnail ??
                      "https://www.ourastore.com/_next/image?url=https://cdn.ourastore.com/ourastore.com/product/MLBBIndofix-ezgif.com-optijpeg.jpg&w=1920&q=75"
                    }
                    className="aspect-square h-14 w-14 rounded-[calc(var(--card-radius)-var(--card-padding))] object-cover object-center duration-300 group-hover/product-card:scale-110 group-hover/product-card:rounded-xl group-hover/product-card:shadow-2xl md:h-20 md:w-20"
                  />
                  <div className="relative flex w-full flex-col">
                    <h2 className="w-[80px] truncate text-[12px] font-semibold text-foreground sm:w-[125px] md:w-[150px] md:text-base lg:w-[175px]">
                      Mobile Legends
                    </h2>
                    <p className="text-[12px] text-foreground md:text-sm">
                      {item.sub_name}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SectionContainer>
  );
}

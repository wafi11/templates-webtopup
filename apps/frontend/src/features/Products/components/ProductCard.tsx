import { Product } from "@repo/types";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/order/${product.slug?.toLowerCase().replaceAll(" ", "-")}`}
      className="relative block outline-none"
    >
      <div className="group relative overflow-hidden rounded-2xl bg-muted transition-all duration-300 ease-in-out hover:shadow-2xl hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background">
        {/* Image Container dengan aspect ratio */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="bg-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              priority={false}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-4xl text-gray-400">📦</span>
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Text Content */}
        <article className="absolute inset-x-0 bottom-0 z-10 flex flex-col px-3 py-2 transition-all duration-300 ease-in-out translate-y-full group-hover:translate-y-0 sm:px-4 sm:py-3">
          <h2 className="truncate text-sm font-semibold text-white drop-shadow-lg sm:text-base">
            {product.name}
          </h2>
          {product.sub_name && (
            <p className="truncate text-xs text-white/90 drop-shadow-md sm:text-sm">
              {product.sub_name}
            </p>
          )}
        </article>
      </div>
    </Link>
  );
}

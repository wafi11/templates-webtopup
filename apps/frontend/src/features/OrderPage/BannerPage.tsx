import Image from "next/image";
interface BannerOrderImageProps {
  image: string;
  title: string;
}

export function BannerOrderImage({ image, title }: BannerOrderImageProps) {
  return (
    <div className="relative">
      <Image
        src={image}
        alt={title}
        fetchPriority="high"
        width={1280}
        height={1280}
        className="min-h-56 w-full bg-muted object-cover object-center lg:object-contain"
      />
    </div>
  );
}

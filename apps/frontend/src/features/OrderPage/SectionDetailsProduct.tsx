import Image from "next/image";

interface SectionDetailsOrderProductProps {
  image: string;
  name: string;
  subName: string;
}

export function SectionDetailsOrderProduct({
  image,
  name,
  subName,
}: SectionDetailsOrderProductProps) {
  return (
    <section
      aria-labelledby="main-title"
      className="bg-title-product flex min-h-32 w-full items-center border-b bg-transparent lg:min-h-[160px] bg-order-header-background text-order-header-foreground"
    >
      <div className="container">
        <div className="flex items-center gap-2">
          <div className="flex items-start gap-4">
            <div className="product-thumbnail-container relative -top-16 md:-top-28">
              <Image
                width={300}
                height={300}
                loading="lazy"
                src={image}
                alt={name}
                className="z-20 -mb-14 aspect-square w-32 rounded-2xl object-cover shadow-2xl md:-mb-20 md:w-60"
              />
            </div>
          </div>
          <div className="py-4 sm:py-0">
            <h1 className="text-xs font-bold uppercase leading-7 tracking-wider sm:text-lg">
              {name}
            </h1>
            <p className="text-xs font-medium sm:text-base/6">{subName}</p>
            <div className="mt-4 hidden gap-2 text-xs md:flex">
              <div className="flex items-center gap-2">
                <Image
                  alt="Proses Cepat"
                  src="https://res.cloudinary.com/dikf91ikq/image/upload/v1769971221/mkstore/icon/lightning_ftg4wm.gif"
                  width={32}
                  height={32}
                  className="size-8"
                />
                <span className="text-xs/7 font-medium">Proses Cepat</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  alt="Layanan Chat 24/7"
                  src="https://res.cloudinary.com/dikf91ikq/image/upload/v1769971191/mkstore/icon/contact-support_d6exol.gif"
                  width={32}
                  height={32}
                  className="size-8"
                />
                <span className="text-xs/7 font-medium">Layanan Chat 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  alt="Pembayaran Aman!"
                  src="https://res.cloudinary.com/dikf91ikq/image/upload/v1769971308/mkstore/icon/secure_qhsqez.gif"
                  width={28}
                  height={28}
                  className="ml-1.5 mr-0.5 size-5"
                />
                <span className="text-xs/7 font-medium">Pembayaran Aman!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

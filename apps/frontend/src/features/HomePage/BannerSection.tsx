"use client";

import { SectionContainer } from "@/components/layouts/SectionContainer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

const bannerImages = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dikf91ikq/image/upload/v1769717973/Blue_and_White_Modern_9.9_Flash_Sale_Promotion_Banner_Horizontal_bv8eoe.png",
    alt: "Banner Promo 1",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dikf91ikq/image/upload/v1769717973/Blue_and_White_Modern_9.9_Flash_Sale_Promotion_Banner_Horizontal_bv8eoe.png",
    alt: "Banner Promo 2",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dikf91ikq/image/upload/v1769717973/Blue_and_White_Modern_9.9_Flash_Sale_Promotion_Banner_Horizontal_bv8eoe.png",
    alt: "Banner Promo 3",
  },
];

export function BannerSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const banners = bannerImages ?? [];

  const handleSlideChange = useCallback(
    (newIndex: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide(newIndex);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning],
  );

  const nextSlide = () => {
    handleSlideChange((currentSlide + 1) % banners.length);
  };

  const prevSlide = () => {
    handleSlideChange((currentSlide - 1 + banners.length) % banners.length);
  };

  if (banners.length === 0) {
    return null;
  }

  return (
    <SectionContainer className="bg-secondary/50">
      <div className="group relative w-full max-w-7xl mx-auto">
        {/* Slides Container */}
        <div className="relative h-full aspect-[1080/424]  overflow-hidden rounded-3xl">
          {banners.map((banner, index) => (
            <div
              key={banner.id || index}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                index === currentSlide
                  ? "opacity-100 scale-100 z-10"
                  : "opacity-0 scale-105 z-0"
              }`}
            >
              <Image
                src={banner.src}
                alt={banner.alt || `Banner ${index + 1}`}
                fill
                className=""
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              disabled={isTransitioning}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 md:p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={nextSlide}
              disabled={isTransitioning}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 md:p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 hidden md:flex -translate-x-1/2 z-20  gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                disabled={isTransitioning}
                className={`transition-all duration-300 rounded-full disabled:cursor-not-allowed ${
                  index === currentSlide
                    ? "w-8 h-2 bg-white"
                    : "w-2 h-2 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}

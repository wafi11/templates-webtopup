import { Contact, Star, StarHalf } from "lucide-react";

export function RatingContainer() {
  const rating = 4.99;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="hidden flex-col items-start justify-center gap-1 rounded-xl bg-card/50 p-4 text-card-foreground shadow-2xl lg:flex">
        <div className="text-sm font-semibold tracking-wide">
          Ulasan dan rating
        </div>
        <div className="flex items-baseline gap-4">
          <div className="text-[40px] font-bold leading-none xl:text-[50px]">
            4.99
          </div>
          <div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, idx) => {
                if (idx < Math.floor(rating)) {
                  return (
                    <Star
                      key={idx}
                      className="size-10 fill-yellow-400 text-yellow-400"
                    />
                  );
                } else if (idx === Math.floor(rating) && rating % 1 !== 0) {
                  return (
                    <StarHalf
                      key={idx}
                      className="size-10 fill-yellow-400 text-yellow-400"
                    />
                  );
                } else {
                  return (
                    <Star
                      key={idx}
                      className="size-10 fill-muted-foreground/20 text-muted-foreground/20"
                    />
                  );
                }
              })}
            </div>
            <div className="ml-1.5 mt-1 flex items-center text-sm font-semibold">
              Berdasarkan total 7.34jt rating
            </div>
          </div>
        </div>
        <div className="inline-flex items-center justify-start gap-4 rounded-xl bg-card/50 p-4 text-card-foreground shadow-2xl">
          <Contact />
          <div className="flex flex-col items-start justify-center">
            <div className="text-sm font-bold">Butuh Bantuan?</div>
            <div className="text-sm font-medium">
              Kamu bisa hubungi admin disini.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

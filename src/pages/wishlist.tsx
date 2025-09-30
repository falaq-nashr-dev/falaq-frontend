import { Heart } from "lucide-react";
import Product from "./components/product";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function Wishlist() {
  const wishlist = useWishlistStore((s) => s.wishlist);

  const isEmpty = !wishlist || wishlist.length === 0;

  return (
    <div className="bg-white sm:bg-[#E9F2F8] pb-12">
      <div className="container max-w-7xl mx-auto px-3 sm:px-1 xs:py-3 sm:py-6">
        <h1 className="font-semibold text-xl md:text-3xl sm:mt-2">
          Sevimlilar
        </h1>

        {isEmpty ? (
          <div className="mt-3 sm:mt-6">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Heart
                  className="h-16 w-16 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Sevimlilar bo&apos;sh
              </h2>
            </div>
          </div>
        ) : (
          <div className="mt-3 sm:mt-6 pb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-3 overflow-x-auto scrollbar-hide overflow-y-hidden">
            {wishlist.map((book) => (
              <Product key={book.id} book={book} isLiked />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

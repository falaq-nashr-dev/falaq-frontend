import ProductSkeleton from "@/components/product-skeleton";
import { Request } from "@/helpers/Request";
import { AdminBooks } from "@/types";
import { useEffect, useState } from "react";
import NewCard from "@/components/new-card";
import { getImage } from "@/helpers/image";
import { useCartStore } from "@/store/useCartStore";

const HomeProducts = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<AdminBooks[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCartStore();

  const fetchProducts = async (query: string) => {
    const endpoint = query
      ? `/products/search?query=${query}&typeId=all`
      : `/products`;
    try {
      setLoading(true);
      setError(null);
      const { data } = await Request<AdminBooks[]>(endpoint, "GET", undefined);
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Kitoblar topilmadi.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts("");
  }, []);

  return (
    <div className="bg-white  py-2">
      <div className="container max-w-7xl mx-auto px-3 xs:py-3 sm:px-1 sm:py-6">
        <h1 className="font-semibold text-xl md:text-3xl">Kitoblar</h1>
        {/* Error state */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Products Grid */}
        <div className="mt-6 pb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-4 md:gap-4 md:gap-y-6 overflow-x-auto scrollbar-hide overflow-y-hidden">
          {loading &&
            Array.from({ length: 4 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}

          {!loading && !products.length && !error && (
            <p className="col-span-full text-center text-gray-500">
              Hech qanday mahsulot topilmadi
            </p>
          )}

          {products.map((book) => (
            // <Product key={book.id} book={book} />
            <NewCard
              quantity={book.quantity}
              key={book.id}
              id={book.id}
              imageUrl={getImage(book.photo?.prefix, book.photo?.name)}
              price={book.salePrice}
              title={book.name}
              addToCart={() => addToCart(book, 1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeProducts;

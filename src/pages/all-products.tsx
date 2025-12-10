import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Request } from "../helpers/Request";
import ProductSkeleton from "@/components/product-skeleton";
import { AdminBooks } from "@/types";
import { LuSearch } from "react-icons/lu";
import NewCard from "@/components/new-card";
import { getImage } from "@/helpers/image";
import { useCartStore } from "@/store/useCartStore";

const AllProducts = () => {
  const { state } = useLocation();
  const { addToCart } = useCartStore();

  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [products, setProducts] = useState<AdminBooks[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(
    async (query = "") => {
      setLoading(true);
      setError(null);

      try {
        const endpoint = query
          ? `/products/search?query=${query}&typeId=${state?.typeId ?? "all"}`
          : state?.typeId
          ? `/products/by-type/${state.typeId}`
          : "/products/by-type/all";

        const { data } = await Request<AdminBooks[]>(
          endpoint,
          "GET",
          undefined,
          true
        );

        // normalize response
        const normalized = Array.isArray(data)
          ? data
          : (data as { products: AdminBooks[] })?.products ?? [];

        setProducts(normalized);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Mahsulotlarni yuklashda xatolik yuz berdi.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [state?.typeId]
  );

  useEffect(() => {
    // initial fetch
    fetchProducts();
  }, [fetchProducts]);

  // Debounced search
  useEffect(() => {
    if (searchValue.trim() === "") {
      // if input cleared → fetch all products immediately
      fetchProducts();
      return;
    }

    const handler = setTimeout(() => {
      fetchProducts(searchValue);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValue, fetchProducts]);

  // Auto focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="bg-white py-2 pb-12">
      <div className="container max-w-7xl mx-auto px-3 sm:px-1 xs:py-3 sm:py-6">
        {/* Search */}
        <div className="relative">
          <LuSearch className="size-5 text-gray-600 absolute top-1/2 -translate-y-1/2 left-3" />
          <input
            ref={inputRef}
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            id="search"
            type="text"
            placeholder="Qidirish..."
            className="block mt-1 w-full h-12 max-w-xl bg-[#C4C4C426]/15 rounded-xl pl-10 focus:outline-blue-500"
          />
        </div>

        {/* Title */}
        <div className="flex items-center justify-between mt-4">
          <h1 className="font-semibold text-xl md:text-3xl">
            {state?.typeName ?? "Barcha kitoblar"}
          </h1>
        </div>

        {/* Products */}
        <div className="mt-6 pb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-3 overflow-x-auto scrollbar-hide overflow-y-hidden">
          {loading &&
            Array.from({ length: 6 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}

          {error && (
            <p className="col-span-full text-center text-red-500">{error}</p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              Hech qanday mahsulot topilmadi
            </p>
          )}

          {products.map((book) => (
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

export default AllProducts;

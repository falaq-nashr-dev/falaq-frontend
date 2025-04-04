import { useEffect, useState, useCallback, useRef } from "react";
import { LuSearch } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import ProductGrid from "./components/product-grid";
import BottomNavigation from "../components/bottom-navigation";
import ProductGridSkeleton from "./components/product-grid-skeleton";
import { Request } from "../helpers/Request";
import { getImage } from "../helpers/image";

type ProductPhoto = { name: string; prefix: string };
export type Product = {
  id: string;
  name: string;
  salePrice: number;
  photo: ProductPhoto;
  rating: number;
};

const AllProducts = () => {
  const { state } = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = useCallback(
    async (query = "") => {
      setLoading(true);
      try {
        const endpoint = query
          ? `/products/search?query=${query}&typeId=${state?.typeId ?? "all"}`
          : state?.typeId
          ? `/products/by-type/${state.typeId}`
          : "/products/by-type/all";

        const { data } = await Request<Product[]>(endpoint, "GET");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setProducts(query ? data : (data as any)?.products ?? data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [state?.typeId]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (searchValue === "") fetchProducts();
  }, [searchValue, fetchProducts]);

  const handleSearch = (searchVal: string) => {
    setSearchValue(searchVal);
    if (searchVal.trim()) fetchProducts(searchVal);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="pb-20 pt-1">
      <div className="container py-3 px-4 mx-auto max-w-xl">
        <div className="relative">
          <LuSearch className="size-5 text-gray-600 absolute top-1/2 -translate-y-1/2 left-3" />
          <input
            ref={inputRef}
            onChange={(e) => handleSearch(e.target.value)}
            value={searchValue}
            id="search"
            type="text"
            placeholder="Qidirish..."
            className="block mt-1 w-full h-12 bg-gray-100 rounded-xl pl-10 focus:outline-blue-500"
          />
        </div>

        <div className="mt-3">
          <h3 className="text-[#212121] text-lg font-semibold">
            {state?.typeName ?? "Barcha mahsulotlar"}
          </h3>
          <div className="mt-6 space-y-2">
            {products.length <= 0 && <p>Kitob topilmadi</p>}
            {loading
              ? Array.from({ length: 4 }, (_, index) => (
                  <ProductGridSkeleton key={index} />
                ))
              : products?.map(({ id, name, salePrice, photo, rating }) => (
                  <ProductGrid
                    key={id}
                    id={id}
                    imageUrl={getImage(photo.prefix, photo.name)}
                    price={salePrice}
                    rating={rating}
                    name={name}
                  />
                ))}
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default AllProducts;

import { useEffect, useRef, useState } from "react";
import { Request } from "../helpers/Request";
import ProductSkeleton from "../components/product-skeleton";
import ProductCard from "./components/product-card";
import { Product } from "./all-products";
import { LuSearch } from "react-icons/lu";
import BottomNavigation from "../components/bottom-navigation";

const CardProducts = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const endpoint = searchValue
      ? `/products/search?query=${searchValue}&typeId=all`
      : `/products`;
    try {
      setLoading(true);
      const { data } = await Request<Product[]>(endpoint, "GET", {}, true);
      setProducts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchValue]);

  const handleSearch = (searchVal: string) => {
    setSearchValue(searchVal);
    // if (searchVal.trim()) fetchProducts(searchVal);
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
          {products.length <= 0 && <p>Kitob topilmadi</p>}
          {loading &&
            [1, 1, 1, 1, 1, 1].map((_, ind) => <ProductSkeleton key={ind} />)}
          {products.map((book, ind) => (
            <ProductCard key={ind} book={book} />
          ))}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default CardProducts;

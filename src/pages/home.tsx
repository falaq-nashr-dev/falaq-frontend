import { useEffect, useState } from "react";
import BottomNavigation from "../components/bottom-navigation";
import { Request } from "../helpers/Request";
import SearchHeader from "./components/search-header";
import SpecialProducts from "./components/special-products";
import { BookWithType } from "../types";

const Home = () => {
  const [products, setProducts] = useState<BookWithType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooksWithType();
  }, []);

  const fetchBooksWithType = async () => {
    try {
      setLoading(true);
      const { data } = await Request<BookWithType[]>(
        "/products/by-type",
        "GET"
      );
      setProducts(data);
    } catch (error) {
      console.log(typeof error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-1 relative pb-20">
      <div className="container py-3 px-4 mx-auto max-w-xl min-h-[500px]">
        <SearchHeader />
        <div>
          {products.map((product, ind) => (
            <div key={ind} className="mt-4">
              <SpecialProducts data={product} loading={loading} />
            </div>
          ))}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Home;

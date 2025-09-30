import { useEffect, useState } from "react";
import BooksWithType from "./bookWithType";
import { BookWithType } from "@/types";
import { Request } from "@/helpers/Request";

const BookWithTypeWrapper = () => {
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
        "GET",
        {},
        true
      );
      setProducts(data);
    } catch (error) {
      console.log(typeof error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-12">
      {products.map((product, ind) => (
        <div key={ind} className="mt-1">
          <BooksWithType data={product} loading={loading} />
        </div>
      ))}
    </div>
  );
};

export default BookWithTypeWrapper;

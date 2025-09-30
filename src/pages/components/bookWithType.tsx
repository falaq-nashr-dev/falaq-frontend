import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookWithType } from "@/types";
import ProductSkeleton from "@/components/product-skeleton";
import { useNavigate } from "react-router-dom";
import { getImage } from "@/helpers/image";
import NewCard from "@/components/new-card";
import { useCartStore } from "@/store/useCartStore";

interface BooksWithTypeProps {
  data: BookWithType;
  loading: boolean;
}

const BooksWithType = ({ data, loading }: BooksWithTypeProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();

  return (
    <div className="container max-w-7xl mx-auto px-3 sm:px-1 pb-3 sm:py-6 mb-3">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl md:text-3xl">{data.typeName}</h1>
        <Button
          onClick={() =>
            navigate(`/all-products?type=${data?.typeName?.toLowerCase()}`, {
              state: {
                typeId: data.id,
                typeName: data.typeName,
              },
            })
          }
          variant={"link"}
          className="cursor-pointer pr-0 sm:pr-[1rem] text-[16px] text-[#348AEC] font-semibold"
        >
          Ko&apos;proq
          <ChevronRight size={20} className="-ml-1 mt-[3px] text-black" />
        </Button>
      </div>
      <div className="mt-3 sm:mt-6 grid grid-flow-col auto-cols-[minmax(170px,1fr)] sm:auto-cols-[minmax(180px,1fr)] md:auto-cols-[minmax(200px,1fr)]  gap-4 md:gap-3 overflow-x-auto scrollbar-hide overflow-y-hidden">
        {loading &&
          Array(4)
            .fill(null)
            .map((_, index) => <ProductSkeleton key={index} />)}
        {data.products.map((book) => (
          // <Product key={ind} book={book} />
          <NewCard
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
  );
};

export default BooksWithType;

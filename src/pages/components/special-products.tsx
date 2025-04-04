import { GoChevronRight } from "react-icons/go";
import Product from "./product";
import { BookWithType } from "../../types";
import ProductSkeleton from "../../components/product-skeleton";
import { useNavigate } from "react-router-dom";

interface SpecialProductsProps {
  data: BookWithType;
  loading: boolean;
}

const SpecialProducts = ({ data, loading }: SpecialProductsProps) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-lg text-gray-700">{data.typeName}</h1>
        <div
          onClick={() =>
            navigate(`/all-products?type=${data?.typeName?.toLowerCase()}`, {
              state: {
                typeId: data.id,
                typeName: data.typeName,
              },
            })
          }
          className="flex items-center group"
        >
          <p className="text-gray-500 font-normal hover:underline">Hammasi</p>
          <GoChevronRight className="size-5 text-gray-700 mt-[1px] group-hover:translate-x-[1px] transition-all duration-300" />
        </div>
      </div>
      <div className="mt-2 flex flex-nowrap overflow-x-auto scrollbar-hide gap-4">
        {loading &&
          Array(4)
            .fill(null)
            .map((_, index) => <ProductSkeleton key={index} />)}
        {data.products.map((book, ind) => (
          <Product key={ind} book={book} />
        ))}
      </div>
    </div>
  );
};

export default SpecialProducts;

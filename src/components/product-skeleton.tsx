const ProductSkeleton = () => {
  return (
    <div className="max-w-[145px] flex-shrink-0 w-full rounded-md">
      <div className="max-w-[145px] flex justify-center items-center">
        <div className="w-full h-[220px] bg-gray-200 rounded-md animate-pulse"></div>
      </div>
      <div className="mt-[6px]">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="flex items-center justify-between mt-1">
          <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;

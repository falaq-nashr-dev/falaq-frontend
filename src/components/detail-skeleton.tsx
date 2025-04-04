const DetailSkeleton = () => {
  return (
    <div className="mt-3 min-h-[500px] animate-pulse">
      <div className="flex flex-col items-center">
        <div className="w-[200px] h-[300px] bg-gray-300 rounded-md"></div>
        <div className="w-3/4 h-6 bg-gray-300 mt-3 rounded"></div>
        <div className="w-1/2 h-4 bg-gray-300 mt-1 rounded"></div>
        <div className="w-1/3 h-6 bg-gray-300 mt-4 rounded"></div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-x-3 w-1/2">
            <div className="w-[66px] h-[49px] bg-gray-300 rounded-md"></div>
            <div className="w-[56px] h-[48px] bg-gray-300 rounded-md"></div>
          </div>
          <div className="w-12 h-6 bg-gray-300 rounded"></div>
          <div className="flex items-center gap-x-3 w-1/2">
            <div className="w-[56px] h-[48px] bg-gray-300 rounded-md"></div>
            <div className="w-[66px] h-[49px] bg-gray-300 rounded-md"></div>
          </div>
        </div>

        <div className="mt-5 h-[48px] bg-gray-300 rounded-xl w-full"></div>
      </div>
    </div>
  );
};

export default DetailSkeleton;

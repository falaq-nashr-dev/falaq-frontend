import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (value: number) => void;
};

const FixedPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="fixed bottom-5 mx-auto left-0 right-0 bg-white shadow-lg py-2 flex items-center justify-between px-4 z-50 max-w-xs rounded-lg">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md text-sm font-medium flex items-center ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-800 hover:bg-gray-200 transition"
        }`}
      >
        <FaChevronLeft className="inline-block mr-1" /> <span>Prev</span>
      </button>

      {/* Page Indicator */}
      <span className="text-gray-700 font-medium">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md text-sm font-medium flex items-center ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-800 hover:bg-gray-200 transition"
        }`}
      >
        <span>Next</span> <FaChevronRight className="inline-block ml-1" />
      </button>
    </div>
  );
};

export default FixedPagination;

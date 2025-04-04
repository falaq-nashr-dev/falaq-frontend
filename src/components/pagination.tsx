import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (value: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null; // Hide pagination if only one or zero pages

  return (
    <div className="flex items-center space-x-2">
      {/* Previous Button */}
      <button
        className={`px-3 py-1 rounded ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed bg-gray-300"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <GrFormPreviousLink size={22} />
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, idx) => {
        const pageNum = idx + 1;
        return (
          <button
            key={pageNum} // Use page number as key instead of index
            disabled={currentPage === pageNum}
            className={`px-3 py-1 rounded ${
              currentPage === pageNum
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        className={`px-3 py-1 rounded ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed bg-gray-300"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <GrFormNextLink size={22} />
      </button>
    </div>
  );
};

export default Pagination;

// import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";

// type PaginationProps = {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (value: number) => void;
// };

// const Pagination = ({
//   currentPage,
//   totalPages,
//   onPageChange,
// }: PaginationProps) => {
//   if (totalPages <= 1) return null; // Hide pagination if only one or zero pages
//   return (
//     <div className="flex items-center space-x-2">
//       <button
//         className={`px-3 py-[5px] ${
//           currentPage === 1
//             ? "opacity-50 cursor-not-allowed"
//             : "bg-blue-500 hover:bg-blue-600 text-white rounded"
//         }`}
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//       >
//         <GrFormPreviousLink size={22} />
//       </button>

//       {[...Array(totalPages).keys()].map((_, idx) => (
//         <button
//           key={idx}
//           disabled={currentPage === idx + 1}
//           className={`px-3 py-1 ${
//             currentPage === idx + 1
//               ? "bg-blue-500 text-white"
//               : "bg-gray-200 hover:bg-gray-300"
//           }`}
//           onClick={() => onPageChange(idx + 1)}
//         >
//           {idx + 1}
//         </button>
//       ))}

//       <button
//         className={`px-3 py-[5px] ${
//           currentPage === totalPages
//             ? "opacity-50 cursor-not-allowed"
//             : "bg-blue-500 hover:bg-blue-600 text-white rounded"
//         }`}
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//       >
//         <GrFormNextLink size={22} />
//       </button>
//     </div>
//   );
// };

// export default Pagination;

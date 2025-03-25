import React, { useDebugValue, useState } from "react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const PaginationBar = ({ pageSize, totalPages, reloadPage, styles }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      reloadPage(currentPage + 1, pageSize ?? 10);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      reloadPage(currentPage - 1, pageSize ?? 10);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
    reloadPage(1, pageSize ?? 10);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
    reloadPage(totalPages, pageSize ?? 10);
  };

  const handlePageNumberClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    reloadPage(pageNumber, pageSize ?? 10);
  };

  return (
    <div className={`flex justify-center items-center ${styles}`}>
      <div
        className="px-2 py-[2px] m-1 rounded text-white cursor-pointer hover:text-secondary-200"
        onClick={handleFirstPage}
      >
        <MdKeyboardDoubleArrowLeft size={24} />
      </div>
      <div
        className="px-2 py-[2px] m-1 rounded text-white cursor-pointer hover:text-secondary-200"
        onClick={handlePreviousPage}
      >
        <MdKeyboardArrowLeft size={24} />
      </div>
      <div>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageNumberClick(i + 1)}
            className={`${
              i + 1 === currentPage
                ? "bg-green-700 text-white"
                : "bg-gray-600 text-white hover:text-secondary-200"
            } px-2 m-1 rounded`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div
        className="px-2 py-[2px] m-1 rounde text-white cursor-pointer hover:text-secondary-200"
        onClick={handleNextPage}
      >
        <MdKeyboardArrowRight size={24} />
      </div>
      <div
        className="px-2 py-[2px] m-1 rounded text-white cursor-pointer hover:text-secondary-200"
        onClick={handleLastPage}
      >
        <MdKeyboardDoubleArrowRight size={24} />
      </div>
    </div>
  );
};

export default PaginationBar;

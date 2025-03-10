import React, { useDebugValue, useState } from "react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const PaginationBar = ({
  pageSize,
  totalPages,
  nextPage,
  previousPage,
  firstPage,
  lastPage,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      nextPage();
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      previousPage();
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
    firstPage();
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
    lastPage();
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className="px-2 py-[2px] m-1 rounded text-white cursor-pointer"
        onClick={handleFirstPage}
      >
        <MdKeyboardDoubleArrowLeft size={24} />
      </div>
      <div
        className="px-2 py-[2px] m-1 rounded text-white cursor-pointer"
        onClick={handlePreviousPage}
      >
        <MdKeyboardArrowLeft size={24} />
      </div>
      <div>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`${
              i + 1 === currentPage
                ? "bg-green-700 text-white"
                : "bg-gray-600 text-white"
            } px-2 m-1 rounded`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div
        className="px-2 py-[2px] m-1 rounde text-white cursor-pointer"
        onClick={handleNextPage}
      >
        <MdKeyboardArrowRight size={24} />
      </div>
      <div
        className="px-2 py-[2px] m-1 rounded text-white cursor-pointer"
        onClick={handleLastPage}
      >
        <MdKeyboardDoubleArrowRight size={24} />
      </div>
    </div>
  );
};

export default PaginationBar;

import React, { useDebugValue, useState, useEffect } from "react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const PaginationBar = ({
  currentPage,
  setCurrentPage,
  pageSize,
  totalPages,
  reloadPage,
  styles,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const renderPageNumbers = () => {
    const maxVisiblePages = isMobile ? 5 : 10;
    const pages = [];

    if (totalPages <= maxVisiblePages) {
      // If total pages is less than max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible pages
      let startPage, endPage;

      if (isMobile) {
        // For mobile, show exactly 5 pages including first and last
        if (currentPage <= 3) {
          // Near start
          startPage = 2;
          endPage = 4;
        } else if (currentPage >= totalPages - 2) {
          // Near end
          startPage = totalPages - 3;
          endPage = totalPages - 1;
        } else {
          // Middle
          startPage = currentPage - 1;
          endPage = currentPage + 1;
        }
      } else {
        // Desktop logic remains the same
        startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
        endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);

        if (endPage === totalPages - 1) {
          startPage = Math.max(2, endPage - maxVisiblePages + 3);
        }
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={`flex justify-center items-center text-[10px] lg:text-[16px] pb-4 lg:pb-8 mb-16 lg:mb-20 ${styles}`}
    >
      <div
        className="px-1 py-[1px] m-0.5 lg:px-2 lg:py-[2px] lg:m-1 rounded text-white cursor-pointer hover:text-secondary-200"
        onClick={handleFirstPage}
      >
        <MdKeyboardDoubleArrowLeft className="text-sm lg:text-base" />
      </div>
      <div
        className="px-1 py-[1px] m-0.5 lg:px-2 lg:py-[2px] lg:m-1 rounded text-white cursor-pointer hover:text-secondary-200"
        onClick={handlePreviousPage}
      >
        <MdKeyboardArrowLeft className="text-sm lg:text-base" />
      </div>
      <div className="flex items-center">
        {renderPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1 m-0.5 lg:px-2 lg:m-1 text-white text-[10px] lg:text-base"
            >
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => handlePageNumberClick(page)}
              className={`${
                page === currentPage
                  ? "bg-green-700 text-white"
                  : "bg-gray-600 text-white hover:text-secondary-200"
              } px-1.5 py-0.5 m-0.5 lg:px-2 lg:py-1 lg:m-1 rounded text-[10px] lg:text-base min-w-[20px] lg:min-w-[24px]`}
            >
              {page}
            </button>
          )
        )}
      </div>
      <div
        className="px-1 py-[1px] m-0.5 lg:px-2 lg:py-[2px] lg:m-1 rounded text-white cursor-pointer hover:text-secondary-200"
        onClick={handleNextPage}
      >
        <MdKeyboardArrowRight className="text-sm lg:text-base" />
      </div>
      <div
        className="px-1 py-[1px] m-0.5 lg:px-2 lg:py-[2px] lg:m-1 rounded text-white cursor-pointer hover:text-secondary-200"
        onClick={handleLastPage}
      >
        <MdKeyboardDoubleArrowRight className="text-sm lg:text-base" />
      </div>
    </div>
  );
};

export default PaginationBar;

import React from "react";

const CardLoading = () => {
  return (
    <div className="border p-2 lg:p-4 grid gap-1 lg:gap-3 max-w-36 lg:max-w-52 rounded cursor-pointer bg-gray-700 animate-pulse">
      <div className="min-h-20 bg-gray-600 rounded"></div>
      <div className="p-2 lg:p-3  bg-gray-600 rounded w-10"></div>
      <div className="p-2 lg:p-3 bg-gray-600 rounded"></div>
      <div className="p-2 lg:p-3 bg-gray-600 rounded w-14"></div>

      <div className="flex items-center justify-between gap-3 max-w-32">
        <div className="p-2 lg:p-3 bg-gray-600 rounded w-20"></div>
        <div className="p-2 lg:p-3 bg-gray-600 rounded w-20"></div>
      </div>
    </div>
  );
};

export default CardLoading;

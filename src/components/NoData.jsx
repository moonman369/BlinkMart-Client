import React from "react";
import noDataImg from "../assets/not_found.webp";

const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 gap-4 mt-[10%]">
      <img src={noDataImg} alt="No data found" className="w-36" />
      <h2 className="text-2xl text-gray-500 font-semibold mt-4">
        Nothing to see here
      </h2>
    </div>
  );
};

export default NoData;

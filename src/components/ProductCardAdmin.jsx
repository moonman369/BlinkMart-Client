import React from "react";

const ProductCardAdmin = ({ data }) => {
  return (
    <div className="w-32 overflow-hidden rounded shadow-md p-2 bg-gray-700 group">
      <div>
        <img
          src={data?.image[0]}
          alt={data?.name}
          className="w-full h-full object-scale-down rounded"
        />
      </div>
      <p className="text-ellipsis line-clamp-2 font-semibold">{data?.name}</p>
      <p>{data?.unit}</p>
    </div>
  );
};

export default ProductCardAdmin;

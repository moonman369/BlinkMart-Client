import React, { useState } from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { getINRString } from "../util/getINRString";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";

const ProductCardAdmin = ({ data, fetchProducts }) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <>
      <div className="w-40 overflow-hidden rounded shadow-md p-3 bg-gray-700 group mb-7">
        <div className="h-32">
          <img
            src={data?.image[0]}
            alt={data?.name}
            className="w-full h-full object-scale-down rounded"
          />
        </div>
        <p className="text-ellipsis line-clamp-2 font-semibold text-sm mt-2">
          {data?.name}
        </p>
        <p className="font-light text-green-500 text-xs mt-1">{data?.unit}</p>

        {/* Price Section */}
        <div className="mt-3">
          {data?.discount > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center text-yellow-400 text-xs line-through">
                <FaIndianRupeeSign className="text-[10px]" />
                {data?.price}
              </div>
              <div className="flex items-center text-green-500 text-sm font-semibold">
                <FaIndianRupeeSign className="text-xs" />
                {((data?.price * (100 - data?.discount)) / 100).toFixed(2)}
              </div>
            </div>
          ) : (
            <div className="flex items-center text-green-500 text-sm font-semibold">
              <FaIndianRupeeSign className="text-xs" />
              {data?.price}
            </div>
          )}
          {data?.discount > 0 && (
            <div className="text-red-500 text-xs mt-1">
              {data?.discount}% OFF
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => setOpenEditModal(true)}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-bg-primary-100 rounded py-1 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => setOpenDeleteModal(true)}
            className="flex-1 bg-red-400 hover:bg-red-500 text-bg-primary-100 rounded py-1 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>

      {openEditModal && (
        <EditProductModal
          closeModal={() => setOpenEditModal(false)}
          product={data}
          fetchProducts={fetchProducts}
        />
      )}

      {openDeleteModal && (
        <DeleteProductModal
          closeModal={() => setOpenDeleteModal(false)}
          product={data}
          fetchProducts={fetchProducts}
        />
      )}
    </>
  );
};

export default ProductCardAdmin;

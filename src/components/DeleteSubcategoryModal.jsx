import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import customAxios from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";
import toast from "react-hot-toast";
import { axiosToastError } from "../util/axiosToastError";
import useScrollLock from "../hooks/useScrollLock";
import { showToast } from "../config/toastConfig";

const DeleteSubcategoryModal = ({
  closeModal,
  subcategory,
  fetchSubcategories,
}) => {
  const [processing, setProcessing] = useState(false);

  // Lock scroll when modal is open
  useScrollLock(true);

  const handleDelete = async () => {
    try {
      setProcessing(true);
      const deleteResponse = await customAxios({
        url: `${apiSummary.endpoints.subcategory.deleteSubcategory.path}/${subcategory?._id}`,
        method: apiSummary.endpoints.subcategory.deleteSubcategory.method,
      });

      if (
        deleteResponse.status ===
        apiSummary.endpoints.subcategory.deleteSubcategory.successStatus
      ) {
        showToast.success("Successfully deleted subcategory! ✅");
        fetchSubcategories();
        closeModal();
      }
    } catch (error) {
      console.error(error);
      axiosToastError(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-700 max-w-sm lg:max-w-[40%] w-full p-4 rounded-md">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-[22px]">Delete Subcategory</h1>
          <button
            className="w-fit block ml-auto text-red-600"
            onClick={closeModal}
          >
            <IoClose size={25} />
          </button>
        </div>
        <div className="flex-col items-center justify-center pt-4">
          <p className="my-4 flex items-center justify-center text-[16px] ml-3 text-red-500">
            Are you sure you want to permanently delete this category?
          </p>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={handleDelete}
              className="px-4 py-1 rounded bg-red-400 hover:bg-red-500 text-bg-primary-100 font-semibold"
              disabled={processing}
            >
              {processing ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-bg-primary-100 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeleteSubcategoryModal;

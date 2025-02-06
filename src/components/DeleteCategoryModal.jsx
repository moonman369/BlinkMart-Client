import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import customAxios from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";
import toast from "react-hot-toast";
import { axiosToastError } from "../util/axiosToastError";

const DeleteCategoryModal = ({ closeModal, category, fetchCategories }) => {
  const [processing, setProcessing] = useState(false);

  const handleDelete = async () => {
    try {
      setProcessing(true);
      const deleteResponse = await customAxios({
        url: `${apiSummary.endpoints.category.deleteCategory.path}/${category?._id}`,
        method: apiSummary.endpoints.category.deleteCategory.method,
      });

      if (
        deleteResponse.status ===
        apiSummary.endpoints.category.deleteCategory.successStatus
      ) {
        toast.success("Successfully deleted category! ✅");
        fetchCategories();
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
          <h1 className="font-semibold text-[22px]">Delete Category</h1>
          <button
            className="w-fit block ml-auto text-red-600"
            onClick={closeModal}
          >
            <IoClose size={25} />
          </button>
        </div>
        <div className="flex-col items-center justify-center">
          <p className="my-4 text-[16px] ml-3">
            Are you sure you want to{" "}
            <b className="text-red-400">&nbsp;permanently delete&nbsp;</b> this
            category?
          </p>
          <div className="w-fit ml-auto flex items-center gap-6">
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

export default DeleteCategoryModal;

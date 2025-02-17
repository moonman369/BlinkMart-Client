import React, { useEffect, useState } from "react";
import AddSubcategoryModal from "../components/AddSubcategoryModal";
import axios from "axios";
import { axiosToastError } from "../util/axiosToastError";
import customAxios from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";

const SubCategories = () => {
  const [openAddSubcategoryModal, setOpenAddSubcategoryModal] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubcategories = async () => {
    try {
      const subcategoryResponse = await customAxios({
        url: apiSummary.endpoints.subcategory.getAllSubcategories.path,
        method: apiSummary.endpoints.subcategory.getAllSubcategories.method,
      });
      if (
        subcategoryResponse.status ===
        apiSummary.endpoints.subcategory.getAllSubcategories.successStatus
      ) {
        setSubcategories(subcategoryResponse.data.data);
      }
    } catch (error) {
      axiosToastError(error);
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, []);

  console.log("subcategories", subcategories);

  return (
    <section>
      <div className="p-3 font-semibold bg-gray-900 shadow-secondary-200 shadow-md rounded-md flex items-center justify-between">
        <h2 className="text-[20px]">Subcategories</h2>
        <button
          className={`text-white p-3 rounded font-semibold tracking-wider bg-green-700 hover:bg-green-800`}
          onClick={() => setOpenAddSubcategoryModal(true)}
        >
          Add Subcategory
        </button>
      </div>

      {openAddSubcategoryModal && (
        <AddSubcategoryModal
          closeModal={() => setOpenAddSubcategoryModal(false)}
          fetchSubcategories={() => {}}
        />
      )}
    </section>
  );
};

export default SubCategories;

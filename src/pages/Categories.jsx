import React, { useEffect, useState } from "react";
import AddCategoryModal from "../components/AddCategoryModal";
import LoadingSpinner from "../components/LoadingSpinner";
import NoData from "../components/NoData";
import customAxios from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";
import { axiosToastError } from "../util/axiosToastError";
import noImage from "../assets/no_image.png";

const Categories = () => {
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      const fetchCategoriesResponse = await customAxios({
        url: apiSummary.endpoints.category.getAllCategories.path,
        method: apiSummary.endpoints.category.getAllCategories.method,
      });
      console.log(fetchCategoriesResponse);
      if (
        fetchCategoriesResponse.status ===
        apiSummary.endpoints.category.getAllCategories.successStatus
      ) {
        setCategories(fetchCategoriesResponse?.data?.data);
      }
    } catch (error) {
      axiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  return (
    <section>
      <div className="p-3 font-semibold bg-gray-900 shadow-secondary-200 shadow-md rounded-md flex items-center justify-between">
        <h2 className="text-[20px]">Categories</h2>
        <button
          className={`text-white p-3 rounded font-semibold tracking-wider bg-green-700 hover:bg-green-800`}
          onClick={() => setOpenAddCategoryModal(true)}
        >
          Add Category
        </button>
      </div>

      {categories.length <= 0 && !loading && <NoData />}

      <div className="grid grid-cols-4 gap-4 p-4">
        {categories.map((category, index) => {
          return (
            <div className="w-32 overflow-hidden rounded shadow-md">
              <img
                src={category?.image === "" ? noImage : category?.image}
                alt={category?.name}
                className=""
              />
            </div>
          );
        })}
      </div>

      {loading && <LoadingSpinner />}

      {openAddCategoryModal && (
        <AddCategoryModal
          fetchCategories={fetchAllCategories}
          closeModal={() => {
            setOpenAddCategoryModal(false);
          }}
        />
      )}
    </section>
  );
};

export default Categories;

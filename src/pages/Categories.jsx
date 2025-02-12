import React, { useEffect, useState } from "react";
import AddCategoryModal from "../components/AddCategoryModal";
import LoadingSpinner from "../components/LoadingSpinner";
import NoData from "../components/NoData";
import customAxios from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";
import { axiosToastError } from "../util/axiosToastError";
import noImage from "../assets/no_image.png";
import EditCategoryModal from "../components/EditCategoryModal";
import DeleteCategoryModal from "../components/DeleteCategoryModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "../util/fetchAllCategories";
import { setAllCategories } from "../store/productSlice";

const Categories = () => {
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [categories, setCategories] = useState([]);
  const categories = useSelector((state) => state.product.allCategories);
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
  const [categoryProp, setCategoryProp] = useState({});
  const [openDeleteCategoryModal, setOpenDeleteCategoryModal] = useState(false);
  const dispatch = useDispatch();

  const refreshCategories = async () => {
    try {
      setLoading(true);
      const fetchCategoriesResponse = await fetchAllCategories();
      console.log(fetchCategoriesResponse);
      if (
        fetchCategoriesResponse.status ===
        apiSummary.endpoints.category.getAllCategories.successStatus
      ) {
        console.log("Refresh Categories", fetchCategoriesResponse);
        dispatch(setAllCategories(fetchCategoriesResponse.data.data));
      }
    } catch (error) {
      console.error("Fetch Categories Error: ", error);
      axiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (category) => {
    setOpenEditCategoryModal(true);
    setCategoryProp(category);
  };
  const handleDeleteClick = (category) => {
    setOpenDeleteCategoryModal(true);
    setCategoryProp(category);
  };

  useEffect(() => {
    // fetchAllCategories();
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

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 p-6 mt-4">
        {categories.map((category, index) => {
          return (
            <div className="w-32 overflow-hidden rounded shadow-md group">
              <img
                src={category?.image === "" ? noImage : category?.image}
                alt={category?.name}
                className="rounded"
                key={index}
              />
              <div className="items-center h-9 flex gap-2">
                <button
                  onClick={() => handleEditClick(category)}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-bg-primary-100 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(category)}
                  className="flex-1 bg-red-400 hover:bg-red-500 text-bg-primary-100 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {loading && <LoadingSpinner />}

      {openAddCategoryModal && (
        <AddCategoryModal
          fetchCategories={refreshCategories}
          closeModal={() => {
            setOpenAddCategoryModal(false);
          }}
        />
      )}

      {openEditCategoryModal && (
        <EditCategoryModal
          closeModal={() => setOpenEditCategoryModal(false)}
          category={categoryProp}
          fetchCategories={refreshCategories}
        />
      )}

      {openDeleteCategoryModal && (
        <DeleteCategoryModal
          closeModal={() => setOpenDeleteCategoryModal(false)}
          category={categoryProp}
          fetchCategories={refreshCategories}
        />
      )}
    </section>
  );
};

export default Categories;

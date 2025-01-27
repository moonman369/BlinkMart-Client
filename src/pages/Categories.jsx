import React, { useEffect, useState } from "react";
import AddCategoryModal from "../components/AddCategoryModal";
import LoadingSpinner from "../components/LoadingSpinner";

const Categories = () => {
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchAllCategories = async () => {
    try {
      setLoading(true);
    } catch (error) {
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

      {categories.length <= 0 && !loading && <p>No Categories Found</p>}

      {loading && <LoadingSpinner />}

      {openAddCategoryModal && (
        <AddCategoryModal
          closeModal={() => {
            setOpenAddCategoryModal(false);
          }}
        />
      )}
    </section>
  );
};

export default Categories;

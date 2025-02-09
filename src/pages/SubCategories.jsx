import React, { useState } from "react";
import AddSubcategoryModal from "../components/AddSubcategoryModal";

const SubCategories = () => {
  const [openAddSubcategoryModal, setOpenAddSubcategoryModal] = useState(false);

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
        />
      )}
    </section>
  );
};

export default SubCategories;

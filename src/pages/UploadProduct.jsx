import React, { useState } from "react";

const UploadProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    image: [],
    category: [],
    subcategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: "",
  });

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
    </section>
  );
};

export default UploadProduct;

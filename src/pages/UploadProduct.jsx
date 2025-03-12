import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

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

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleUploadProductImage = (e) => {
    const files = e.target.files;
    console.log("files", files);
    if (files && files.length > 0) {
      setProductData({
        ...productData,
        image: [...productData?.image, ...files],
      });
    }
  };

  const removeImage = (index) => {
    const newImages = productData.image.filter((img, i) => i !== index);
    setProductData({ ...productData, image: newImages });
  };

  return (
    <section>
      <div className="p-3 font-semibold bg-gray-900 shadow-secondary-200 shadow-md rounded-md flex items-center justify-between">
        <h2 className="text-[20px]">Add Product</h2>
      </div>
      <div className="mt-10 p-5 bg-gray-800 shadow-secondary-200 shadow-sm rounded-md">
        <form className="grid gap-5">
          <div className="grid gap-2">
            <label htmlFor="name">Name*</label>
            <input
              type="text"
              placeholder="Enter product name"
              value={productData?.name}
              onChange={handleChange}
              name="name"
              required
              className="p-2 border rounded bg-gray-700 flex items-center outline-none focus-within:border-highlight-100"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="description">Description*</label>
            <textarea
              type="text"
              placeholder="Enter product description"
              value={productData?.description}
              onChange={handleChange}
              name="name"
              rows={2}
              required
              className="p-2 border rounded bg-gray-700 flex items-center outline-none focus-within:border-highlight-100"
            />
          </div>

          <div>
            <p>Images (Optional)</p>
            <div className="flex gap-4 flex-col items-center">
              <div className="border bg-gray-800 h-36 w-full lg:w-50 rounded focus-within:border-primary-200 outline-none flex items-center justify-center text-neutral-500">
                {productData?.image?.length > 0 ? (
                  productData?.image.map((img, index) => (
                    <div className="relative group" key={index}>
                      <img
                        key={index}
                        src={URL.createObjectURL(img)}
                        className="overflow-hidden h-24 p-4"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 p-1 group-hover:bg-black group-hover:bg-opacity-60 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <RxCrossCircled className="text-red-500 w-6 h-6" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center flex flex-col items-center justify-center h-full px-10">
                    <FaCloudUploadAlt size={35} />
                    <p className="text-xs">Upload Image</p>
                  </div>
                )}
              </div>
              <label htmlFor="image">
                <div
                  className={`${
                    productData.name
                      ? "bg-primary-100 hover:bg-primary-200"
                      : "bg-gray-900"
                  } text-gray-800 p-2 text-[12px] rounded font-semibold tracking-wider cursor-pointer`}
                  disabled={!productData.name}
                >
                  Upload Image
                </div>
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={handleUploadProductImage}
                  accept="image/*"
                  multiple
                />
              </label>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UploadProduct;

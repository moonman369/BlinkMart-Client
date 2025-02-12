import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { IMAGE_MIMETYPE_LIST } from "../util/constants.js";
import { useSelector } from "react-redux";

const AddSubcategoryModal = ({ fetchSubcategories, closeModal }) => {
  const [newSubcategoryData, setNewSubcategoryData] = useState({
    name: "",
    image: null,
    categories: [],
  });
  const [processing, setProcessing] = useState(false);
  const categories = useSelector((state) => state.product.allCategories);

  const handleOnChange = (e) => {
    e.preventDefault();
    const newCategoryId = e.target.value;
    const newCategory = categories.find(
      (category) => category?._id === newCategoryId
    );
    console.log(newCategory);
    setNewSubcategoryData((prevData) => ({
      ...prevData,
      categories: [...prevData?.categories, newCategory],
    }));
  };

  const removeCategory = (categoryId) => {
    const newCategories = newSubcategoryData.categories.filter(
      (category) => category?._id !== categoryId
    );
    setNewSubcategoryData((prevData) => ({
      ...prevData,
      categories: newCategories,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setProcessing(true);
      if (!newSubcategoryData.name) {
        toast.error("Category Name is required!");
        return;
      }
      const formData = new FormData();
      formData.append("name", newSubcategoryData?.name);
      formData.append("image", newSubcategoryData?.image);
      const response = await customAxios({
        url: apiSummary.endpoints.category.addCategory.path,
        method: apiSummary.endpoints.category.addCategory.method,
        data: formData,
      });
      console.log("response", response);
      if (
        response.status ===
        apiSummary.endpoints.category.addCategory.successStatus
      ) {
        fetchSubcategories();
        toast.success(response.data.message);
        closeModal();
      }
    } catch (error) {
      axiosToastError(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleUploadSubcategoryImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file?.type);
      if (IMAGE_MIMETYPE_LIST.includes(file.type)) {
        // const fileBase64String = await getFileAsBase64(file);
        setNewSubcategoryData((prevData) => ({
          ...prevData,
          image: file,
        }));
      } else {
        toast.error(
          `Invalid file format! Choose a format from this list: ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/tiff', 'image/svg+xml', 'image/x-icon', 'image/heif', 'image/heic']`
        );
      }
    }
  };

  console.log("newSubcategoryData", newSubcategoryData);

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-700 max-w-4xl lg:max-w-[40%] w-full p-4 rounded-md">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-[18px]">New Subcategory</h1>
          <button
            className="w-fit block ml-auto text-red-600"
            onClick={closeModal}
          >
            <IoClose size={25} />
          </button>
        </div>
        <form className="my-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label htmlFor="name">Name*</label>
            <input
              type="text"
              name="name"
              value={newSubcategoryData?.name}
              className="w-full p-2 border rounded bg-gray-800 mt- focus-within:border-primary-200 outline-none"
              onChange={handleOnChange}
              placeholder="Enter Subcategory Name"
            />
          </div>
          <div className="grid gap-2">
            <p>Image (Optional)</p>
            <div className="flex gap-4 flex-col items-center">
              <div className="border bg-gray-800 h-36 w-full lg:w-50 rounded focus-within:border-primary-200 outline-none flex items-center justify-center text-neutral-500">
                {newSubcategoryData?.image ? (
                  <img
                    src={URL.createObjectURL(newSubcategoryData?.image)}
                    className="overflow-hidden h-32"
                  />
                ) : (
                  <p>No Image</p>
                )}
              </div>
              <label htmlFor="newCategoryImage">
                <div
                  className={`${
                    newSubcategoryData.name
                      ? "bg-primary-100 hover:bg-primary-200"
                      : "bg-gray-900"
                  } text-gray-800 p-2 text-[12px] rounded font-semibold tracking-wider cursor-pointer`}
                  disabled={!newSubcategoryData.name}
                >
                  Upload Image
                </div>
                <input
                  type="file"
                  id="newCategoryImage"
                  className="hidden"
                  onChange={handleUploadSubcategoryImage}
                />
              </label>
            </div>
            <div className="grid gap-2 mt-4">
              <label>Select Category*</label>
              <div className="bg-gray-800 border p-3 focus-within:border-primary-200 outline-none rounded w-full gap-2">
                <div
                  className={`flex gap-2 flex-wrap ${
                    newSubcategoryData?.categories?.length > 0
                      ? "border-b border-gray-500 pb-2"
                      : ""
                  }`}
                >
                  {newSubcategoryData?.categories?.map((category, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-[14px] text-secondary-200 font-semibold p-1 rounded flex items-center justify-center gap-1"
                    >
                      <p>{category?.name}</p>
                      <IoClose
                        size={15}
                        className="cursor-pointer flex items-center justify-center bg-yellow-900 text-primary-200 rounded-full"
                        onClick={() => {
                          removeCategory(category?._id);
                        }}
                      />
                    </span>
                  ))}
                </div>
                <select
                  className="w-full outline-none bg-gray-800"
                  onChange={handleOnChange}
                  name="category"
                >
                  <option className="text-[14px]" value={""}>
                    Select category
                  </option>
                  {categories.map((category, index) => (
                    <option
                      className="text-[14px]"
                      key={index}
                      value={category?._id}
                    >
                      {category?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              className={`text-white p-4 rounded font-semibold mt-8 tracking-wider text-[17px] ${
                newSubcategoryData.name
                  ? "bg-green-700 hover:bg-green-800"
                  : "bg-gray-900"
              }`}
              disabled={!newSubcategoryData.name || processing}
            >
              {processing ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddSubcategoryModal;

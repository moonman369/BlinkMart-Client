import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IMAGE_MIMETYPE_LIST } from "../util/constants.js";
import { useSelector } from "react-redux";
import { apiSummary } from "../config/api/apiSummary.js";
import { axiosToastError } from "../util/axiosToastError.js";
import customAxios from "../util/customAxios.js";
import toast from "react-hot-toast";
import { checkCategoriesArrayEquality } from "../util/checkCategoriesArrayEquality.js";
import SelectionDropDown from "./SelectionDropDown.jsx";
import { fetchAllCategories } from "../util/fetchAllCategories.js";

const EditSubcategoryModal = ({
  fetchSubcategories,
  closeModal,
  subcategory,
}) => {
  const [editSubcategoryData, setEditSubcategoryData] = useState(subcategory);
  const [processing, setProcessing] = useState(false);
  // const categories = useSelector((state) => state.product.allCategories);
  const [categoryBucket, setCategoryBucket] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const performFetchCategories = async () => {
      const fetchAllCategoriesResponse = await fetchAllCategories({
        all: true,
      });
      console.log("fetchAllCategoriesResponse", fetchAllCategoriesResponse);
      setCategories(fetchAllCategoriesResponse?.data?.data);
    };

    performFetchCategories();
  }, []);
  console.log("categories", categories);

  useEffect(() => {
    setEditSubcategoryData(subcategory);
  }, [subcategory]);

  useEffect(() => {
    const newCategoryBucket = categories.filter(
      (category) =>
        !editSubcategoryData?.category.find(
          (subCategory) => subCategory?._id === category?._id
        )
    );
    setCategoryBucket(newCategoryBucket);
  }, [editSubcategoryData, categories]);

  const handleOnNameChange = (e) => {
    e.preventDefault();
    const newSubcategoryName = e?.target?.value;
    setEditSubcategoryData((prevData) => ({
      ...prevData,
      name: newSubcategoryName,
    }));
  };

  // const handleOnCategorySelect = (e) => {
  //   e.preventDefault();
  //   const newCategoryId = e.target.value;
  //   const newCategory = categories.find(
  //     (category) => category?._id === newCategoryId
  //   );
  //   console.log(newCategory);
  //   setEditSubcategoryData((prevData) => ({
  //     ...prevData,
  //     category: [...prevData?.category, newCategory],
  //   }));

  //   const newCategoryBucket = categoryBucket.filter(
  //     (category) => category?._id !== newCategoryId
  //   );
  //   setCategoryBucket(newCategoryBucket);
  //   e.target.value = "";
  // };

  // useEffect(() => {
  //   console.log(
  //     "condition",
  //     editSubcategoryData?.name != null,
  //     editSubcategoryData?.category?.length > 0,
  //     !processing,
  //     editSubcategoryData?.name !== subcategory?.name,
  //     editSubcategoryData?.image !== subcategory?.image,
  //     !checkCategoriesArrayEquality(
  //       editSubcategoryData?.category,
  //       subcategory?.category
  //     )
  //   );
  // }, [editSubcategoryData, subcategory]);

  const handleAddOrRemove = (newCollection) => {
    setEditSubcategoryData((prevData) => ({
      ...prevData,
      category: newCollection,
    }));
  };

  const removeCategory = (categoryId) => {
    const newCategories = editSubcategoryData?.category.filter(
      (category) => category?._id !== categoryId
    );
    setEditSubcategoryData((prevData) => ({
      ...prevData,
      category: newCategories,
    }));

    setCategoryBucket((prevBucket) => [
      ...prevBucket,
      categories.find((category) => category?._id === categoryId),
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setProcessing(true);
      if (!editSubcategoryData.name) {
        toast.error("Category Name is required!");
        return;
      }
      const formData = new FormData();
      formData.append("name", editSubcategoryData?.name);
      formData.append(
        "categories",
        JSON.stringify(editSubcategoryData?.category?.map((cat) => cat?._id))
      );
      formData.append("image", editSubcategoryData?.image);
      const response = await customAxios({
        url: `${apiSummary.endpoints.subcategory.updateSubcategory.path}/${editSubcategoryData?._id}`,
        method: apiSummary.endpoints.subcategory.updateSubcategory.method,
        data: formData,
      });
      console.log("response", response);
      if (
        response.status ===
        apiSummary.endpoints.subcategory.updateSubcategory.successStatus
      ) {
        fetchSubcategories();
        toast.success(response.data.message);
        closeModal();
      }
    } catch (error) {
      console.error(error);
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
        setEditSubcategoryData((prevData) => ({
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

  console.log("editSubcategoryData", editSubcategoryData);

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-700 max-w-4xl lg:max-w-[40%] w-full p-4 rounded-md">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-[18px]">Edit Subcategory</h1>
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
              value={editSubcategoryData?.name}
              className="w-full p-2 border rounded bg-gray-800 mt- focus-within:border-primary-200 outline-none"
              onChange={handleOnNameChange}
              placeholder="Enter Subcategory Name"
            />
          </div>
          <div className="grid gap-2">
            <p>Image (Optional)</p>
            <div className="flex gap-4 flex-col items-center">
              <div className="border bg-gray-800 h-36 w-full lg:w-50 rounded focus-within:border-primary-200 outline-none flex items-center justify-center text-neutral-500">
                {editSubcategoryData?.image ? (
                  <img
                    src={
                      typeof editSubcategoryData?.image != "string"
                        ? URL.createObjectURL(editSubcategoryData?.image)
                        : editSubcategoryData?.image
                    }
                    className="overflow-hidden h-32"
                  />
                ) : (
                  <p>No Image</p>
                )}
              </div>
              <label htmlFor="newCategoryImage">
                <div
                  className={`${
                    editSubcategoryData.name
                      ? "bg-primary-100 hover:bg-primary-200"
                      : "bg-gray-900"
                  } text-gray-800 p-2 text-[12px] rounded font-semibold tracking-wider cursor-pointer`}
                  disabled={!editSubcategoryData.name}
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

            <SelectionDropDown
            title={"Category"}
              collection={categoryBucket}
              newCollection={editSubcategoryData?.category}
              handleAddOrRemove={handleAddOrRemove}
            />
            <button
              className={`text-white p-4 rounded font-semibold mt-8 tracking-wider text-[17px] ${
                editSubcategoryData?.name &&
                editSubcategoryData?.category?.length > 0 &&
                !processing &&
                (editSubcategoryData?.name !== subcategory?.name ||
                  editSubcategoryData?.image !== subcategory?.image ||
                  !checkCategoriesArrayEquality(
                    editSubcategoryData?.category,
                    subcategory?.category
                  ))
                  ? "bg-green-700 hover:bg-green-800"
                  : "bg-gray-900"
              }`}
              disabled={
                !editSubcategoryData?.name ||
                editSubcategoryData?.categories?.length <= 0 ||
                processing ||
                (editSubcategoryData?.name === subcategory?.name &&
                  editSubcategoryData?.image === subcategory?.image &&
                  checkCategoriesArrayEquality(
                    editSubcategoryData?.category,
                    subcategory?.category
                  ))
              }
            >
              {processing ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditSubcategoryModal;

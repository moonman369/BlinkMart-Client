import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IMAGE_MIMETYPE_LIST } from "../util/constants";
import customAxios from "../util/customAxios";
import toast from "react-hot-toast";
import { apiSummary } from "../config/api/apiSummary";
import { axiosToastError } from "../util/axiosToastError";
import SelectionDropDown from "./SelectionDropDown";
import { fetchAllCategories } from "../util/fetchAllCategories";
import { fetchAllSubcategories } from "../util/fetchAllSubcategories";
import useScrollLock from "../hooks/useScrollLock";

const EditProductModal = ({ closeModal, product, fetchProducts }) => {
  const [editProductData, setEditProductData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    unit: "",
    image: [],
    category_id: [],
    sub_category_id: [],
    more_details: {},
  });
  const [processing, setProcessing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryBucket, setCategoryBucket] = useState([]);
  const [subcategoryBucket, setSubcategoryBucket] = useState([]);

  // Lock scroll when modal is open
  useScrollLock(true);

  useEffect(() => {
    setEditProductData(product);
  }, [product]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, subcategoriesResponse] = await Promise.all([
          fetchAllCategories({ all: true }),
          fetchAllSubcategories({ all: true }),
        ]);

        if (
          categoriesResponse.status ===
          apiSummary.endpoints.category.getAllCategories.successStatus
        ) {
          setCategories(categoriesResponse.data.data);
        }

        if (
          subcategoriesResponse.status ===
          apiSummary.endpoints.subcategory.getAllSubcategories.successStatus
        ) {
          setSubcategories(subcategoriesResponse.data.data);
        }
      } catch (error) {
        console.error(error);
        axiosToastError(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const newCategoryBucket = categories.filter(
      (category) =>
        !editProductData?.category_id.find((cat) => cat?._id === category?._id)
    );
    setCategoryBucket(newCategoryBucket);

    const newSubcategoryBucket = subcategories.filter(
      (subcategory) =>
        !editProductData?.sub_category_id.find(
          (subcat) => subcat?._id === subcategory?._id
        )
    );
    setSubcategoryBucket(newSubcategoryBucket);
  }, [editProductData, categories, subcategories]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setEditProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddOrRemoveCategory = (newCollection) => {
    setEditProductData((prevData) => ({
      ...prevData,
      category_id: newCollection,
    }));
  };

  const handleAddOrRemoveSubcategory = (newCollection) => {
    setEditProductData((prevData) => ({
      ...prevData,
      sub_category_id: newCollection,
    }));
  };

  const handleUploadProductImage = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) =>
      IMAGE_MIMETYPE_LIST.includes(file.type)
    );

    if (validFiles.length !== files.length) {
      toast.error(
        `Invalid file format! Choose a format from this list: ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/tiff', 'image/svg+xml', 'image/x-icon', 'image/heif', 'image/heic']`
      );
      return;
    }

    setEditProductData((prevData) => ({
      ...prevData,
      image: [...prevData.image, ...validFiles],
    }));
  };

  const removeImage = (index) => {
    setEditProductData((prevData) => ({
      ...prevData,
      image: prevData.image.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setProcessing(true);
      if (!editProductData.name || !editProductData.price) {
        toast.error("Name and Price are required!");
        return;
      }

      const formData = new FormData();
      formData.append("name", editProductData.name);
      formData.append("description", editProductData.description);
      formData.append("price", editProductData.price);
      formData.append("discount", editProductData.discount);
      formData.append("unit", editProductData.unit);
      formData.append(
        "category_id",
        JSON.stringify(editProductData.category_id.map((cat) => cat._id))
      );
      formData.append(
        "sub_category_id",
        JSON.stringify(
          editProductData.sub_category_id.map((subcat) => subcat._id)
        )
      );
      formData.append(
        "more_details",
        JSON.stringify(editProductData.more_details)
      );

      // Handle new images
      editProductData.image.forEach((img, index) => {
        if (typeof img === "string") {
          formData.append(`existing_images[${index}]`, img);
        } else {
          formData.append("new_images", img);
        }
      });

      const response = await customAxios({
        url: `${apiSummary.endpoints.product.updateProduct.path}/${editProductData._id}`,
        method: apiSummary.endpoints.product.updateProduct.method,
        data: formData,
      });

      if (
        response.status ===
        apiSummary.endpoints.product.updateProduct.successStatus
      ) {
        fetchProducts();
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

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-700 max-w-4xl lg:max-w-[60%] w-full p-4 rounded-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-[18px]">Edit Product</h1>
          <button
            className="w-fit block ml-auto text-red-600"
            onClick={closeModal}
          >
            <IoClose size={25} />
          </button>
        </div>
        <form
          className="my-6 grid gap-4 overflow-y-auto pr-2"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-2">
            <label htmlFor="name">Name*</label>
            <input
              type="text"
              name="name"
              value={editProductData?.name}
              className="w-full p-2 border rounded bg-gray-800 focus-within:border-primary-200 outline-none"
              onChange={handleOnChange}
              placeholder="Enter Product Name"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              value={editProductData?.description}
              className="w-full p-2 border rounded bg-gray-800 focus-within:border-primary-200 outline-none"
              onChange={handleOnChange}
              placeholder="Enter Product Description"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="price">Price*</label>
              <input
                type="number"
                name="price"
                value={editProductData?.price}
                className="w-full p-2 border rounded bg-gray-800 focus-within:border-primary-200 outline-none"
                onChange={handleOnChange}
                placeholder="Enter Price"
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="discount">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={editProductData?.discount}
                className="w-full p-2 border rounded bg-gray-800 focus-within:border-primary-200 outline-none"
                onChange={handleOnChange}
                placeholder="Enter Discount"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="unit">Unit</label>
            <input
              type="text"
              name="unit"
              value={editProductData?.unit}
              className="w-full p-2 border rounded bg-gray-800 focus-within:border-primary-200 outline-none"
              onChange={handleOnChange}
              placeholder="Enter Unit (e.g., kg, piece)"
            />
          </div>

          <SelectionDropDown
            title="Categories"
            collection={categoryBucket}
            newCollection={editProductData?.category_id}
            handleAddOrRemove={handleAddOrRemoveCategory}
          />

          <SelectionDropDown
            title="Subcategories"
            collection={subcategoryBucket}
            newCollection={editProductData?.sub_category_id}
            handleAddOrRemove={handleAddOrRemoveSubcategory}
          />

          <div className="grid gap-2">
            <p>Images</p>
            <div className="flex gap-4 flex-col items-center">
              <div className="grid grid-cols-3 gap-4 w-full">
                {editProductData?.image?.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={
                        typeof img === "string" ? img : URL.createObjectURL(img)
                      }
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <IoClose size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <label htmlFor="productImages">
                <div className="bg-primary-100 hover:bg-primary-200 text-gray-800 p-2 text-[12px] rounded font-semibold tracking-wider cursor-pointer">
                  Upload Images
                </div>
                <input
                  type="file"
                  id="productImages"
                  className="hidden"
                  onChange={handleUploadProductImage}
                  multiple
                />
              </label>
            </div>
          </div>

          <button
            className={`text-white p-4 rounded font-semibold mt-8 tracking-wider text-[17px] ${
              editProductData?.name && editProductData?.price && !processing
                ? "bg-green-700 hover:bg-green-800"
                : "bg-gray-900"
            }`}
            disabled={
              !editProductData?.name || !editProductData?.price || processing
            }
          >
            {processing ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditProductModal;

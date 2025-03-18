import React, { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { fetchAllCategories } from "../util/fetchAllCategories";
import { fetchAllSubcategories } from "../util/fetchAllSubcategories";
import { apiSummary } from "../config/api/apiSummary";
import SelectionDropDown from "../components/SelectionDropDown";
import { LuCirclePlus } from "react-icons/lu";
import AddCustomFieldModal from "../components/AddCustomFieldModal";
import { MdOutlineDelete } from "react-icons/md";
import { axiosToastError } from "../util/axiosToastError";
import toast from "react-hot-toast";
import customAxios from "../util/customAxios";

const UploadProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    image: [],
    categories: [],
    subcategories: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });
  const [allCategories, setAllCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [openAddCustomField, setOpenAddCustomField] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const loadAllCategories = async () => {
    try {
      const fetchAllCategoriesResponse = await fetchAllCategories({
        all: true,
      });
      console.log("fetchAllCategoriesResponse", fetchAllCategoriesResponse);
      if (
        fetchAllCategoriesResponse?.status ===
        apiSummary.endpoints.category.getAllCategories.successStatus
      ) {
        setAllCategories(fetchAllCategoriesResponse?.data?.data);
      }
    } catch (error) {
      console.error(error);
      axiosToastError(error);
    }
  };
  const loadAllSubcategories = async () => {
    try {
      const fetchAllSubcategoriesResponse = await fetchAllSubcategories({
        all: true,
      });
      console.log(
        "fetchAllSubcategoriesResponse",
        fetchAllSubcategoriesResponse
      );
      if (
        fetchAllSubcategoriesResponse?.status ===
        apiSummary.endpoints.subcategory.getAllSubcategories.successStatus
      ) {
        setAllSubCategories(fetchAllSubcategoriesResponse?.data?.data);
      }
    } catch (error) {
      console.error(error);
      axiosToastError(error);
    }
  };
  useEffect(() => {
    loadAllCategories();
    loadAllSubcategories();
  }, []);

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

  const handleAddOrRemoveCategories = (newCollection) => {
    setProductData((prevData) => ({
      ...prevData,
      categories: newCollection,
    }));
  };

  const handleAddOrRemoveSubcategories = (newCollection) => {
    setProductData((prevData) => ({
      ...prevData,
      subcategories: newCollection,
    }));
  };

  const handleDeleteCustomField = (index) => {
    setProductData((prevData) => {
      const newCustomFields = { ...prevData.more_details };
      delete newCustomFields[Object.keys(newCustomFields)[index]];
      return {
        ...prevData,
        more_details: newCustomFields,
      };
    });
  };

  const handleCustomFieldChange = (e) => {
    setProductData({
      ...productData,
      more_details: {
        ...productData.more_details,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      if (
        !productData.name ||
        !productData.description ||
        !productData.unit ||
        !productData.stock ||
        !productData.price ||
        !productData.categories.length ||
        !productData.subcategories.length ||
        !productData.image.length
      ) {
        toast.error(
          "Missing one or more required fields: [name, image, categories, subcategories, unit, stock, price, description]"
        );
        setProcessing(false);
        return;
      }
      const formData = new FormData();
      formData.append("name", productData?.name);
      formData.append("description", productData?.description);
      formData.append(
        "categories",
        JSON.stringify(
          productData?.categories?.map((category) => category?._id)
        )
      );
      formData.append(
        "subcategories",
        JSON.stringify(
          productData?.subcategories?.map((subcategory) => subcategory?._id)
        )
      );
      formData.append("unit", productData?.unit);
      formData.append("stock", productData?.stock);
      formData.append("price", productData?.price);
      formData.append("discount", productData?.discount);
      formData.append(
        "more_details",
        JSON.stringify(productData?.more_details)
      );
      formData.append("image", JSON.stringify(productData?.image));
      formData.append("publish", true);
      const response = await customAxios({
        url: apiSummary.endpoints.product.addProduct.path,
        method: apiSummary.endpoints.product.addProduct.method,
        data: formData,
      });
      console.log("add product response", response);
      if (
        response.status ===
        apiSummary.endpoints.product.addProduct.successStatus
      ) {
        toast.success(response.data.message);
        setProductData({
          name: "",
          image: [],
          categories: [],
          subcategories: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        });
      }
    } catch (error) {
      console.error(error);
      axiosToastError(error);
    } finally {
      setProcessing(false);
    }
  };

  console.log("productData", productData);

  return (
    <section>
      <div className="p-3 font-semibold bg-gray-900 shadow-secondary-200 shadow-md rounded-md flex items-center justify-between">
        <h2 className="text-[20px]">Add Product</h2>
      </div>
      <div className="mt-10 p-5 bg-gray-800 shadow-secondary-200 shadow-sm rounded-md">
        <form className="grid gap-5">
          <div className="grid gap-2">
            <label htmlFor="name" className="font-semibold">
              Name*
            </label>
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
            <label htmlFor="description" className="font-semibold">
              Description*
            </label>
            <textarea
              type="text"
              placeholder="Enter product description"
              value={productData?.description}
              onChange={handleChange}
              name="description"
              rows={2}
              required
              className="p-2 border rounded bg-gray-700 flex items-center outline-none focus-within:border-highlight-100"
            />
          </div>

          <div>
            <p className="font-semibold">Images (Optional)</p>
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
                    <p className="text-xs">Upload Image/s</p>
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

          <SelectionDropDown
            title={"Category"}
            collection={allCategories}
            newCollection={productData?.categories}
            handleAddOrRemove={handleAddOrRemoveCategories}
          />

          <SelectionDropDown
            title={"Subcategory"}
            collection={allSubCategories}
            newCollection={productData?.subcategories}
            handleAddOrRemove={handleAddOrRemoveSubcategories}
          />

          <div className="grid gap-2">
            <label htmlFor="unit" className="font-semibold">
              Unit*
            </label>
            <input
              type="text"
              placeholder="Enter product unit"
              value={productData?.unit}
              onChange={handleChange}
              name="unit"
              required
              className="p-2 border rounded bg-gray-700 flex items-center outline-none focus-within:border-highlight-100"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="stock" className="font-semibold">
              Stock*
            </label>
            <input
              type="number"
              min={0}
              placeholder="Enter product stock"
              value={productData?.stock}
              onChange={handleChange}
              name="stock"
              required
              className="p-2 border rounded bg-gray-700 flex items-center outline-none focus-within:border-highlight-100"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="price" className="font-semibold">
              Price*
            </label>
            <input
              type="number"
              min={0}
              placeholder="Enter product price"
              value={productData?.price}
              onChange={handleChange}
              name="price"
              required
              className="p-2 border rounded bg-gray-700 flex items-center outline-none focus-within:border-highlight-100"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="discount" className="font-semibold">
              Discount
            </label>
            <input
              type="number"
              min={0}
              max={100}
              placeholder="Enter discount if applicable"
              value={productData?.discount}
              onChange={handleChange}
              name="discount"
              className="p-2 border rounded bg-gray-700 flex items-center outline-none focus-within:border-highlight-100"
            />
          </div>

          <div
            className={`grid gap-2 ${
              Object.keys(productData?.more_details)?.length > 0
                ? "p-4 shadow-primary-100 shadow-sm rounded-md mt-3"
                : ""
            }`}
          >
            {Object.keys(productData?.more_details)?.length > 0 && (
              <p className="font-semibold text-[20px] mb-3 text-primary-100">
                Custom Fields
              </p>
            )}
            {Object.keys(productData?.more_details)?.map((k, index) => (
              <div key={index} className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor={k} className="font-semibold">
                    {k}
                  </label>
                  <div
                    className="text-gray-800 p-1 bg-red-500 rounded-md hover:bg-red-700 ml-2 cursor-pointer"
                    onClick={() => handleDeleteCustomField(index)}
                  >
                    <MdOutlineDelete size={16} />
                  </div>
                </div>
                <input
                  type="text"
                  placeholder={`Enter ${k}`}
                  value={productData?.more_details[k]}
                  onChange={handleCustomFieldChange}
                  name={k}
                  className="p-2 border rounded bg-gray-700 flex items-center outline-none focus-within:border-highlight-100"
                />
              </div>
            ))}
          </div>

          <div
            className="mt-4 bg-primary-100 hover:bg-primary-200 py-1 px-2 w-[200px] text-gray-800 rounded font-semibold tracking-wider cursor-pointer"
            onClick={() => setOpenAddCustomField(true)}
          >
            <span className="flex items-center justify-center">
              <LuCirclePlus size={20} />
              <p>Add Custom Field</p>
            </span>
          </div>

          <button
            type="submit"
            className="text-white p-3 rounded font-semibold tracking-wider bg-green-700 hover:bg-green-800 mt-10"
            onClick={handleSubmit}
          >
            Submit
          </button>

          {openAddCustomField && (
            <AddCustomFieldModal
              closeModal={() => setOpenAddCustomField(false)}
              customFields={productData?.more_details}
              setCustomFields={setProductData}
            />
          )}
        </form>
      </div>
    </section>
  );
};

export default UploadProduct;

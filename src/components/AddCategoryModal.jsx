import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { getFileAsBase64 } from "../util/fileToBase64";
import { IMAGE_MIMETYPE_LIST } from "../util/constants";
import toast from "react-hot-toast";

const AddCategoryModal = ({ closeModal }) => {
  const [imageFile, setImageFile] = useState(null);
  const [newCategoryData, setNewCategoryData] = useState({
    name: "",
    image: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setNewCategoryData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file?.type);
      if (IMAGE_MIMETYPE_LIST.includes(file.type)) {
        setImageFile(file);
        const fileBase64String = await getFileAsBase64(file);
        setNewCategoryData((prevData) => ({
          ...prevData,
          image: fileBase64String,
        }));
      } else {
        toast.error(
          `Invalid file format! Choose a format from this list: ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/tiff', 'image/svg+xml', 'image/x-icon', 'image/heif', 'image/heic']`
        );
      }
    }
  };

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-700 max-w-4xl lg:max-w-[40%] w-full p-4 rounded-md">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-[18px]">New Category</h1>
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
              value={newCategoryData?.name}
              className="w-full p-2 border rounded bg-gray-800 mt- focus-within:border-primary-200 outline-none"
              onChange={handleOnChange}
              placeholder="Enter Category Name"
            />
          </div>
          <div className="grid gap-2">
            <p>Image (Optional)</p>
            <div className="flex gap-4 flex-col items-center">
              <div className="border bg-gray-800 h-36 w-full lg:w-50 rounded focus-within:border-primary-200 outline-none flex items-center justify-center text-neutral-500">
                {newCategoryData?.image ? (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    className="overflow-hidden h-32"
                  />
                ) : (
                  <p>No Image</p>
                )}
              </div>
              <label htmlFor="newCategoryImage">
                <div
                  className={`${
                    newCategoryData.name
                      ? "bg-primary-100 hover:bg-primary-200"
                      : "bg-gray-900"
                  } text-gray-800 p-2 text-[12px] rounded font-semibold tracking-wider cursor-pointer`}
                  disabled={!newCategoryData.name}
                >
                  Upload Image
                </div>
                <input
                  type="file"
                  id="newCategoryImage"
                  className="hidden"
                  onChange={handleUploadCategoryImage}
                />
              </label>
            </div>
            <button
              className={`text-white p-4 rounded font-semibold mt-8 tracking-wider text-[17px] ${
                newCategoryData.name
                  ? "bg-green-700 hover:bg-green-800"
                  : "bg-gray-900"
              }`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddCategoryModal;

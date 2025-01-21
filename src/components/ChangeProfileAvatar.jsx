import React, { useRef, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import customAxios from "../util/customAxios";
import toast from "react-hot-toast";
import { axiosToastError } from "../util/axiosToastError";
import { data } from "react-router-dom";
import { apiSummary } from "../config/api/apiSummary";
import { fetchUserDetails } from "../util/fetchUserDetails";
import { setUserDetails } from "../store/userSlice";
import { useDispatch } from "react-redux";

const ChangeProfileAvatar = ({ user, closeModal }) => {
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDeselectFile = (e) => {
    setFile(null);
    inputRef.current.value = null;
  };

  const handleUploadAvatar = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await customAxios({
        url: apiSummary.endpoints.setProfileAvatar.path,
        method: apiSummary.endpoints.setProfileAvatar.method,
        data: formData,
      });

      if (
        response.status === apiSummary.endpoints.setProfileAvatar.successStatus
      ) {
        console.log("upload avatar response: ", response);
        toast.success("Avatar uploaded successfully!");
        const userData = await fetchUserDetails();
        console.log(userData);
        dispatch(setUserDetails(userData?.data?.data));
        closeModal();
      } else {
        toast.error(`Failed to upload avatar! ${response?.data?.errorMessage}`);
      }
    } catch (error) {
      console.error(error);
      axiosToastError(error);
    }
  };

  console.log("file", file);

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-[#1f2937] max-w-sm w-full rounded p-6 flex flex-col items-center justify-center">
        <div
          className="ml-auto cursor-pointer hover:text-red-600"
          onClick={closeModal}
        >
          <MdOutlineClose size={16} />
        </div>
        <div className="w-20 h-20 flex items-center justify-center rounded-full overflow-hidden drop-shadow-lg">
          {user?.avatar ? (
            <img
              src={user?.avatar}
              alt={user.username}
              className="w-full h-full border-secondary-200 border-[3px] rounded-full"
            />
          ) : (
            <FaRegUserCircle size={100} />
          )}
        </div>
        <form className="text-xs mt-6 flex items-center justify-center">
          <label htmlFor="uploadAvatar"></label>
          <input
            ref={inputRef}
            type="file"
            id="uploadAvatar"
            onChange={handleFileSelect}
            className="mt-6 flex items-center justify-center"
          />
          {file && (
            <div
              className="mt-6 ml-2 flex items-center justify-center cursor-pointer hover:text-red-600"
              onClick={handleDeselectFile}
            >
              <MdOutlineClose size={12} />
            </div>
          )}
        </form>
        <button
          className={`text-xs min-w-20 border-[2px] px-3 py-1 rounded-full mt-6 ${
            file && "hover:border-secondary-200 hover:text-secondary-200"
          }`}
          disabled={!file}
          onClick={handleUploadAvatar}
        >
          Upload
        </button>
      </div>
    </section>
  );
};

export default ChangeProfileAvatar;

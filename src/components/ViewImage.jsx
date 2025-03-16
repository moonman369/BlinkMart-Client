import React from "react";
import { IoClose } from "react-icons/io5";

const ViewImage = ({ url, alt, close }) => {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 bg-neutral-900 bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md max-h-[80vh] p-4 bg-gray-800">
        <button
          className="w-fit ml-auto block"
          onClick={close}
          aria-label="Close"
        >
          <IoClose size={24} className="text-red-600" />
        </button>
        <img src={url} alt={alt} className="w-full h-full object-scale-down" />
      </div>
    </div>
  );
};

export default ViewImage;

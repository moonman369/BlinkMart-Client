import React from "react";
import { FaRegUserCircle } from "react-icons/fa";

const ChangeProfileAvatar = ({ user }) => {
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-[#1f2937] max-w-sm w-full rounded p-6 flex flex-col items-center justify-center">
        <div className="w-20 h-20 flex items-center justify-center rounded-full overflow-hidden drop-shadow-lg">
          {user?.avatar ? (
            <img
              src={user?.avatar}
              alt={user.username}
              className="w-full h-full"
            />
          ) : (
            <FaRegUserCircle size={100} />
          )}
        </div>
        <form>
          <label htmlFor="uploadAvatar"></label>
          <input type="file" id="uploadAvatar" className="mt-6" />
        </form>
        <button className="text-xs min-w-20 border-[2px] px-3 py-1 rounded-full mt-6 hover:border-secondary-200 hover:text-secondary-200">
          Upload
        </button>
      </div>
    </section>
  );
};

export default ChangeProfileAvatar;

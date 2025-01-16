import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.user);
  console.log("profile", user);
  return (
    <div>
      <div className="w-20 h-20 flex items-center justify-center rounded-full overflow-hidden drop-shadow-lg">
        {user?.avatar ? (
          <img
            src={user?.avatar}
            alt={user.username}
            className="w-full h-full"
          />
        ) : (
          <FaRegUserCircle size={65} />
        )}
      </div>
      <button className="text-xs min-w-20 border-[2px] px-3 py-1 rounded-full mt-2 hover:border-primary-200 hover:text-primary-200">
        Change
      </button>
    </div>
  );
};

export default Profile;

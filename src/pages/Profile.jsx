import React, { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import ChangeProfileAvatar from "../components/ChangeProfileAvatar";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [openChangeAvatar, setOpenChangeAvatar] = useState(false);

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
      <button
        onClick={() => {
          setOpenChangeAvatar(true);
        }}
        className="text-xs min-w-20 border-[2px] px-3 py-1 rounded-full mt-2 hover:border-primary-200 hover:text-primary-200"
      >
        Change
      </button>

      {openChangeAvatar && <ChangeProfileAvatar user={user} />}
    </div>
  );
};

export default Profile;

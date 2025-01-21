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
      <div className="w-[100px] h-[100px] flex items-center justify-center rounded-full overflow-hidden drop-shadow-lg">
        {user?.avatar ? (
          <img
            src={user?.avatar}
            alt={user.username}
            className="w-full h-full border-secondary-200 border-[3px] rounded-full"
          />
        ) : (
          <FaRegUserCircle size={65} />
        )}
      </div>
      <button
        onClick={() => {
          setOpenChangeAvatar(true);
        }}
        className="text-xs min-w-20 border-[2px] px-3 py-1 rounded-full mt-2 mx-auto hover:border-primary-200 hover:text-primary-200"
      >
        Change
      </button>

      {openChangeAvatar && (
        <ChangeProfileAvatar
          user={user}
          closeModal={() => {
            setOpenChangeAvatar(false);
          }}
        />
      )}
    </div>
  );
};

export default Profile;

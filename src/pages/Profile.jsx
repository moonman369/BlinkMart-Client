import React, { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import ChangeProfileAvatar from "../components/ChangeProfileAvatar";
import customAxios from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";
import toast from "react-hot-toast";
import { axiosToastError } from "../util/axiosToastError";
import { fetchUserDetails } from "../util/fetchUserDetails";
import { setUserDetails } from "../store/userSlice";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [openChangeAvatar, setOpenChangeAvatar] = useState(false);
  const [userData, setUserData] = useState({
    username: user?.username ?? "",
    email: user?.email ?? "",
    mobile: user?.mobile ?? "",
  });
  const [userDataUpdated, setUserDataUpdated] = useState(false);
  const [savingInProgress, setSavingInProgress] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData({
      username: user?.username ?? "",
      email: user?.email ?? "",
      mobile: user?.mobile ?? "",
    });
  }, [user]);

  useEffect(() => {
    // console.log(userData?.username !== user?.username);
    // console.log(userData?.email !== user?.email);
    // console.log(userData?.mobile !== (user?.mobile ?? ""));
    // setUserDataUpdated(JSON.stringify(userData) !== JSON.stringify(user));
    setUserDataUpdated(
      userData?.username !== (user?.username ?? "") ||
        userData?.email !== (user?.email ?? "") ||
        userData?.mobile !== (user?.mobile ?? "")
    );
  }, [user, userData]);

  const handleOnUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUserData = async (e) => {
    e.preventDefault();
    try {
      if (userDataUpdated) {
        setSavingInProgress(true);
        const response = await customAxios({
          url: apiSummary.endpoints.user.updateUserDetails.path,
          method: apiSummary.endpoints.user.updateUserDetails.method,
          data: userData,
        });

        if (
          response?.status ===
          apiSummary.endpoints.user.updateUserDetails.successStatus
        ) {
          setUserDataUpdated(false);
          const freshUserData = await fetchUserDetails();
          dispatch(setUserDetails(freshUserData?.data?.data));
          toast.success(response?.data?.message);
        }
      }
    } catch (error) {
      axiosToastError(error);
      setSavingInProgress(false);
    } finally {
      setSavingInProgress(false);
    }
  };

  console.log("profile", user);

  return (
    <div>
      <div className="flex-col">
        <div className="w-[120px] h-[120px] flex items-center justify-center rounded-full overflow-hidden drop-shadow-lg">
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
          className="text-xs min-w-20 border-[2px] px-3 py-1 rounded-full mt-5 mx-[16px] hover:border-primary-200 hover:text-primary-200"
        >
          Change
        </button>
      </div>

      {openChangeAvatar && (
        <ChangeProfileAvatar
          user={user}
          closeModal={() => {
            setOpenChangeAvatar(false);
          }}
        />
      )}

      {/* name, mob, email, change pwd */}
      <form className="my-4 grid gap-4" onSubmit={handleSaveUserData}>
        <div className="grid gap-2">
          <label htmlFor="username">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="p-2 border rounded bg-gray-700 flex items-center outline-none focus-within:border-primary-200"
            name="username"
            value={userData?.username}
            onChange={handleOnUserDataChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            placeholder="Enter your email"
            className="p-2 border rounded bg-gray-700 flex items-center outline-none focus-within:border-primary-200"
            name="email"
            value={userData?.email}
            onChange={handleOnUserDataChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="mobile">Mobile Number</label>
          <input
            type="text"
            placeholder="Enter your mobile number"
            className="p-2 border rounded bg-gray-700 flex items-center outline-none focus-within:border-primary-200"
            name="mobile"
            value={userData?.mobile}
            onChange={handleOnUserDataChange}
            // required
          />
        </div>

        <button
          className={`${
            userDataUpdated ? "bg-green-700 hover:bg-green-800" : "bg-gray-500"
          } text-white py-3 rounded font-semibold my-8 tracking-wider w-full`}
          disabled={!userDataUpdated}
        >
          {savingInProgress ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default Profile;

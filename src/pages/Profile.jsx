import React, { useEffect, useState } from "react";
import {
  FaRegUserCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import ChangeProfileAvatar from "../components/ChangeProfileAvatar";
import customAxios from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";
import toast from "react-hot-toast";
import { axiosToastError } from "../util/axiosToastError";
import { fetchUserDetails } from "../util/fetchUserDetails";
import { setUserDetails } from "../store/userSlice";
import { showToast } from "../config/toastConfig";

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
  const [sendingVerification, setSendingVerification] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData({
      username: user?.username ?? "",
      email: user?.email ?? "",
      mobile: user?.mobile ?? "",
    });
  }, [user]);

  useEffect(() => {
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
          showToast.success(response?.data?.message);
        }
      }
    } catch (error) {
      axiosToastError(error);
      setSavingInProgress(false);
    } finally {
      setSavingInProgress(false);
    }
  };

  // Function to send verification email
  const handleSendVerificationEmail = async () => {
    try {
      setSendingVerification(true);
      const response = await customAxios({
        url: apiSummary.endpoints.user.sendVerificationEmail.path,
        method: apiSummary.endpoints.user.sendVerificationEmail.method,
      });

      if (
        response.status ===
        apiSummary.endpoints.user.sendVerificationEmail.successStatus
      ) {
        showToast.success("Verification email sent successfully!");
      } else {
        showToast.error("Failed to send verification email.");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      showToast.error("Failed to send verification email. Please try again.");
    } finally {
      setSendingVerification(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
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

      {/* Email Verification Status - Added mb-6 for bottom margin */}
      <div className="mt-6 mb-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold mb-3">Email Verification</h3>

        <div className="flex items-center">
          <div className="mr-4">
            {user.email_is_verified ? (
              <div className="h-12 w-12 rounded-full bg-green-900/30 flex items-center justify-center">
                <FaCheckCircle className="text-green-500 text-2xl" />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full bg-yellow-900/30 flex items-center justify-center">
                <FaExclamationTriangle className="text-yellow-500 text-2xl" />
              </div>
            )}
          </div>

          <div>
            {user.email_is_verified ? (
              <div>
                <p className="font-medium">Email Verified</p>
                <p className="text-sm text-gray-400">
                  Your email address has been verified.
                </p>
              </div>
            ) : (
              <div>
                <p className="font-medium">Email Not Verified</p>
                <p className="text-sm text-gray-400">
                  Please verify your email address to enjoy all features.
                </p>
                <button
                  onClick={handleSendVerificationEmail}
                  disabled={sendingVerification}
                  className="mt-2 mb-1 flex items-center gap-2 bg-secondary-200 hover:bg-secondary-300 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  {sendingVerification ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <MdEmail />
                      <span>Send Verification Email</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ...rest of profile content... */}
    </div>
  );
};

export default Profile;

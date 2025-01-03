import toast from "react-hot-toast";

export const axiosToastError = (error) => {
  toast.error(
    error?.response?.data?.errorMessage || "Unexpected Error Occured!"
  );
};

import toast from "react-hot-toast";
import { showToast } from "../config/toastConfig";

export const axiosToastError = (error) => {
  showToast.error(
    error?.response?.data?.errorMessage || "Unexpected Error Occured!"
  );
};

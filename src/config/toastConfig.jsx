import toast, { Toaster } from "react-hot-toast";

// Custom toast configuration
export const toastOptions = {
  // Duration in milliseconds
  duration: 1800,

  // Style for better user experience
  style: {
    borderRadius: "8px",
    background: "#333",
    color: "#fff",
    padding: "12px 16px",
    cursor: "pointer", // Add cursor pointer to indicate clickability
  },

  // Custom success style
  success: {
    iconTheme: {
      primary: "#10B981",
      secondary: "#FFFFFF",
    },
  },

  // Custom error style
  error: {
    iconTheme: {
      primary: "#EF4444",
      secondary: "#FFFFFF",
    },
  },

  // Position
  position: "top-center",
};

// Custom toast component with swipe to dismiss
export const CustomToaster = () => (
  <Toaster
    position="top-center"
    reverseOrder={false}
    gutter={8}
    containerClassName=""
    containerStyle={{}}
    toastOptions={{
      ...toastOptions,
      // Important: This is where we handle the click to dismiss
      onClick: () => {
        toast.dismiss();
      },
      // Enable swipe to dismiss
      className: "swipe-to-dismiss",
      // Explicitly enable dismissing by click
      duration: 1500,
    }}
  />
);

// Add a dismiss handler to each toast function
const createToastWithDismiss = (toastFn, message, options) => {
  const id = toastFn(message, {
    ...toastOptions,
    ...options,
    onClick: () => toast.dismiss(id),
  });
  return id;
};

// Custom toast wrapper functions with click-to-dismiss functionality
export const showToast = {
  success: (message, options = {}) =>
    createToastWithDismiss(toast.success, message, options),

  error: (message, options = {}) =>
    createToastWithDismiss(toast.error, message, options),

  loading: (message, options = {}) =>
    createToastWithDismiss(toast.loading, message, options),

  custom: (message, options = {}) =>
    createToastWithDismiss(toast, message, options),
};

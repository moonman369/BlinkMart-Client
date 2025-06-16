export const apiSummary = {
  baseUrl: import.meta.env["VITE_APP_SERVER_BASE_URL"],
  endpoints: {
    user: {
      register: {
        path: "api/v1/user/register",
        method: "post",
        successStatus: 201,
      },
      login: {
        path: "api/v1/user/login",
        method: "post",
        successStatus: 200,
      },
      getUserDetails: {
        path: "api/v1/user/get-details",
        method: "get",
        successStatus: 200,
      },
      forgotPassword: {
        path: "api/v1/user/forgot-password",
        method: "post",
        successStatus: 200,
      },
      forgotPassword: {
        path: "api/v1/user/forgot-password",
        method: "post",
        successStatus: 200,
      },
      verifyOtp: {
        path: "api/v1/user/verify-forgot-password-otp",
        method: "post",
        successStatus: 200,
      },
      verifyEmail: {
        path: "api/v1/user/verify-email",
        method: "post",
        successStatus: 200,
        alredyVerifiedStatus: 409,
      },
      resetPassword: {
        path: "api/v1/user/reset-password",
        method: "put",
        successStatus: 200,
      },
      refreshToken: {
        path: "api/v1/user/refresh-token",
        method: "post",
        successStatus: 200,
      },
      logout: {
        path: "api/v1/user/logout",
        method: "get",
        successStatus: 200,
      },
      setProfileAvatar: {
        path: "api/v1/user/set-avatar",
        method: "put",
        successStatus: 200,
      },
      updateUserDetails: {
        path: "api/v1/user/update-details",
        method: "put",
        successStatus: 200,
      },
      sendVerificationEmail: {
        path: "api/v1/user/send-verification-email",
        method: "post",
        successStatus: 200,
      },
    },
    category: {
      addCategory: {
        path: "api/v1/category/add-category",
        method: "post",
        successStatus: 201,
      },
      getAllCategories: {
        path: "api/v1/category/get-all-categories",
        method: "get",
        successStatus: 200,
      },
      updateCategory: {
        path: "api/v1/category/update-category",
        method: "put",
        successStatus: 200,
      },
      deleteCategory: {
        path: "api/v1/category/delete-category",
        method: "delete",
        successStatus: 204,
      },
    },
    subcategory: {
      addSubcategory: {
        path: "api/v1/subcategory/add-subcategory",
        method: "post",
        successStatus: 201,
      },
      getAllSubcategories: {
        path: "api/v1/subcategory/get-all-subcategories",
        method: "get",
        successStatus: 200,
      },
      getSubcategoriesByCategory: {
        path: "api/v1/subcategory/get-subcategories-by-category",
        method: "get",
        successStatus: 200,
      },
      updateSubcategory: {
        path: "api/v1/subcategory/update-subcategory",
        method: "put",
        successStatus: 200,
      },
      deleteSubcategory: {
        path: "api/v1/subcategory/delete-subcategory",
        method: "delete",
        successStatus: 200,
      },
    },
    product: {
      addProduct: {
        path: "api/v1/product/add-product",
        method: "post",
        successStatus: 201,
      },
      getProducts: {
        path: "api/v1/product/get-products",
        method: "get",
        successStatus: 200,
      },
      getProductsByCategory: {
        path: "api/v1/product/get-products-by-category",
        method: "get",
        successStatus: 200,
      },
      getProductsBySubategory: {
        path: "api/v1/product/get-products-by-subcategory",
        method: "get",
        successStatus: 200,
      },
      getProductById: {
        path: "api/v1/product/get-product",
        method: "get",
        successStatus: 200,
      },
    },
    cart: {
      getCart: {
        path: "api/v1/cart/get-cart-by-user",
        method: "get",
        successStatus: 200,
      },
      addToCart: {
        path: "api/v1/cart/add-to-cart",
        method: "post",
        successStatus: 200,
      },
      removeFromCart: {
        path: "api/v1/cart/remove-from-cart",
        method: "post",
        successStatus: 200,
      },
      clearCart: {
        path: "api/v1/cart/clear-cart",
        method: "delete",
        successStatus: 200,
      },
    },
    address: {
      getAllAddresses: {
        path: "api/v1/address/get-all-addresses",
        method: "get",
        successStatus: 200,
      },
      addAddress: {
        path: "api/v1/address/add-address",
        method: "post",
        successStatus: 201,
      },
      updateAddress: {
        path: "api/v1/address/update-address",
        method: "put",
        successStatus: 200,
      },
      deleteAddress: {
        path: "api/v1/address/delete-address",
        method: "delete",
        successStatus: 200,
      },
      setDefaultAddress: {
        path: "api/v1/address/set-default",
        method: "put",
        successStatus: 200,
      },
    },
    order: {
      getAllOrders: {
        path: "api/v1/order/get-order-details",
        method: "get",
        successStatus: 200,
      },
      createCodOrder: {
        path: "api/v1/order/create-cod-order",
        method: "post",
        successStatus: 201,
      },
      createOnlineOrder: {
        path: "api/v1/order/create-online-order",
        method: "post",
        successStatus: 201,
      },
      verifyPayment: {
        path: "api/v1/order/verify-payment",
        method: "post",
        successStatus: 200,
      },
      paymentFailed: {
        path: "api/v1/order/payment-failed",
        method: "post",
        successStatus: 200,
      },
      paymentCancelled: {
        path: "api/v1/order/payment-cancelled",
        method: "post",
        successStatus: 200,
      },
    },
  },
};

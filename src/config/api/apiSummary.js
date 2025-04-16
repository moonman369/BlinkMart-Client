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
    },
  },
};

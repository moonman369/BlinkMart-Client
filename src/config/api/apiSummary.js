export const apiSummary = {
  baseUrl: import.meta.env["VITE_APP.SERVER.BASE_URL"],
  endpoints: {
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
  },
};
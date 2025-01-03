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
  },
};

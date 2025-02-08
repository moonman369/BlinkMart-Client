import { USER_ROLE_ADMIN } from "./constants";

export const isAdmin = (user) => {
  return user?.role === USER_ROLE_ADMIN;
};

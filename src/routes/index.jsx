import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOTP from "../pages/VerifyOTP";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobilePage from "../pages/UserMenuMobilePage";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Addresses from "../pages/Addresses";
import Products from "../pages/Products";
import Categories from "../pages/Categories";
import SubCategories from "../pages/SubCategories";
import UploadProduct from "../pages/UploadProduct";
import AdminView from "../layouts/AdminView";
import ProductAdmin from "../pages/ProductAdmin";
import ProductCategorized from "../pages/ProductCategorized";
import ProductDisplay from "../pages/ProductDisplay";
import WelcomePage from "../components/WelcomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <WelcomePage />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOTP />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/user",
        element: <UserMenuMobilePage />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "my-orders",
            element: <MyOrders />,
          },
          {
            path: "addresses",
            element: <Addresses />,
          },
          {
            path: "products",
            element: (
              <AdminView>
                <ProductAdmin />
              </AdminView>
            ),
          },
          {
            path: "categories",
            element: (
              <AdminView>
                <Categories />
              </AdminView>
            ),
          },
          {
            path: "sub-categories",
            element: (
              <AdminView>
                <SubCategories />
              </AdminView>
            ),
          },
          {
            path: "upload-product",
            element: (
              <AdminView>
                <UploadProduct />
              </AdminView>
            ),
          },
        ],
      },
      {
        path: ":category",
        children: [
          {
            path: ":subcategory",
            element: <ProductCategorized />,
          },
        ],
      },
      {
        path: "product/:productId",
        element: <ProductDisplay />,
      },
    ],
  },
]);

export default router;

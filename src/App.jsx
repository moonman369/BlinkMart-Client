import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { fetchUserDetails } from "./util/fetchUserDetails";
import { setUserDetails } from "./store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "./util/fetchAllCategories";
import {
  setAllCategories,
  setAllProducts,
  setAllSubcategories,
  setCategoryPageDetails,
  setLoadingCategory,
  setPaginatedSubcategories,
  setProductPageDetails,
  setSubcategoryPageDetails,
} from "./store/productSlice";
import { all } from "axios";
import { fetchAllSubcategories } from "./util/fetchAllSubcategories";
import { fetchAllProducts } from "./util/fetchAllProducts";
import customAxios from "./util/customAxios";
import { apiSummary } from "./config/api/apiSummary";
import Cookies from "js-cookie";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAndRefreshToken = async () => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    // If both tokens are null, return false to show welcome page
    if (!accessToken && !refreshToken) {
      console.log("Both tokens are missing, showing welcome page");
      return false;
    }

    // If access token is null but refresh token exists, try to refresh
    if (!accessToken && refreshToken) {
      console.log(
        "Access token missing but refresh token exists, attempting refresh"
      );
      try {
        const response = await customAxios({
          url: apiSummary.endpoints.user.refreshToken.path,
          method: apiSummary.endpoints.user.refreshToken.method,
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        if (
          response?.status ===
          apiSummary.endpoints.user.refreshToken.successStatus
        ) {
          console.log("Token refresh successful");
          // Backend will handle setting the new access token cookie
          return true;
        }
      } catch (error) {
        console.error("Token refresh error:", error);
        // If refresh fails, clear tokens and return false to show welcome page
        console.log(
          "Token refresh failed, clearing tokens and showing welcome page"
        );
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        return false;
      }
    }

    // If access token exists, we're good
    console.log("Access token exists, proceeding normally");
    return true;
  };

  const getUser = async () => {
    try {
      const userData = await fetchUserDetails();
      console.log("user", userData);
      dispatch(setUserDetails(userData?.data?.data));
    } catch (error) {
      console.error("Fetch User Error: ", error);
      toast.error("Error fetching user details!");
    }
  };

  const getAllCategories = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const allCategories = await fetchAllCategories({
        all: true,
      });
      console.log("allCategories", allCategories);
      dispatch(setAllCategories(allCategories?.data?.data));
      dispatch(
        setCategoryPageDetails({
          pageSize: allCategories?.data?.pageSize,
          currentPage: allCategories?.data?.currentPage,
          count: allCategories?.data?.count,
          totalCount: allCategories?.data?.totalCount,
        })
      );
    } catch (error) {
      console.error("Fetch Categories Error: ", error);
      toast.error("Error fetching categories!");
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  const getAllSubcategories = async () => {
    try {
      // Load all subcategories for home page
      const allSubcategoriesResponse = await fetchAllSubcategories({
        all: true,
      });
      console.log("allSubcategories", allSubcategoriesResponse);
      dispatch(setAllSubcategories(allSubcategoriesResponse?.data?.data));

      // Load paginated subcategories for admin view
      const paginatedSubcategoriesResponse = await fetchAllSubcategories({
        all: false,
        currentPage: 1,
        pageSize: 10,
      });
      console.log("paginatedSubcategories", paginatedSubcategoriesResponse);
      dispatch(
        setPaginatedSubcategories(paginatedSubcategoriesResponse?.data?.data)
      );
      dispatch(
        setSubcategoryPageDetails({
          pageSize: paginatedSubcategoriesResponse?.data?.pageSize,
          currentPage: paginatedSubcategoriesResponse?.data?.currentPage,
          count: paginatedSubcategoriesResponse?.data?.count,
          totalCount: paginatedSubcategoriesResponse?.data?.totalCount,
        })
      );
    } catch (error) {
      console.error("Fetch Subcategories Error: ", error);
      toast.error("Error fetching subcategories!");
    }
  };

  const getAllProducts = async () => {
    try {
      const allProducts = await fetchAllProducts({
        all: false,
        currentPage: 1,
        pageSize: 12,
      });
      console.log("allProducts", allProducts);
      dispatch(setAllProducts(allProducts?.data?.data));
      dispatch(
        setProductPageDetails({
          pageSize: allProducts?.data?.pageSize,
          currentPage: allProducts?.data?.currentPage,
          count: allProducts?.data?.count,
          totalCount: allProducts?.data?.totalCount,
        })
      );
    } catch (error) {
      console.error("Fetch Products Error: ", error);
      toast.error("Error fetching products!");
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      const isTokenValid = await checkAndRefreshToken();
      if (isTokenValid) {
        getUser();
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (user?._id) {
      getAllCategories();
      getAllSubcategories();
      getAllProducts();
    }
  }, [user]);

  // Redirect to home if user is logged in and on welcome page
  useEffect(() => {
    if (user?._id && location.pathname === "/") {
      navigate("/home");
    }
  }, [user, location.pathname]);

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-8rem)] pb-2">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#d1d5db",
          },
          duration: 3000,
          dismissOnClick: true,
        }}
      />
    </>
  );
}

export default App;

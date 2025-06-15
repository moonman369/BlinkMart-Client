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
import { COOKIE_CLEAR_SETTINGS } from "./util/constants";
import CookieConsent from "./components/CookieConsent";
import { fetchAllCartItems } from "./util/fetchAllCartItems";
import { addToCart } from "./store/cartSlice";
import { setAddresses } from "./store/addressSlice";
import { CustomToaster } from "./config/toastConfig";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [cookiesEnabled, setCookiesEnabled] = useState(true);

  const checkCookiePermissions = () => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    const cookiesEnabled = navigator.cookieEnabled;

    if (!cookiesEnabled) {
      showToast.error(
        "Please enable cookies in your browser settings to use this application."
      );
      setCookiesEnabled(false);
      return false;
    }

    if (cookieConsent === "declined") {
      showToast.error(
        "Cookies are required to use this application. Please accept cookies to continue."
      );
      setCookiesEnabled(false);
      return false;
    }

    setCookiesEnabled(true);
    return true;
  };

  const clearAllStorage = () => {
    // Clear cookies
    Cookies.remove("accessToken", COOKIE_CLEAR_SETTINGS);
    Cookies.remove("refreshToken", COOKIE_CLEAR_SETTINGS);

    // Clear localStorage
    localStorage.clear();

    // Clear sessionStorage
    sessionStorage.clear();

    // Clear Redux store user data
    dispatch(setUserDetails(null));
  };

  const checkAndRefreshToken = async () => {
    if (!checkCookiePermissions()) {
      return false;
    }

    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    // If both tokens are null, redirect to login page and show welcome page
    if (!accessToken && !refreshToken) {
      console.log("Both tokens are missing, redirecting to login page");
      clearAllStorage();
      navigate("/"); // <-- Add this line
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
        // If refresh fails, clear all storage and return false to show welcome page
        console.log(
          "Token refresh failed, clearing all storage and showing welcome page"
        );
        clearAllStorage();
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
      // console.log("user", userData);
      dispatch(setUserDetails(userData?.data?.data));
    } catch (error) {
      console.error("Fetch User Error: ", error);
      showToast.error("Error fetching user details!");
    }
  };

  const getAllCategories = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const allCategories = await fetchAllCategories({
        all: true,
      });
      // console.log("allCategories", allCategories);
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
      showToast.error("Error fetching categories!");
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
      // console.log("allSubcategories", allSubcategoriesResponse);
      dispatch(setAllSubcategories(allSubcategoriesResponse?.data?.data));

      // Load paginated subcategories for admin view
      const paginatedSubcategoriesResponse = await fetchAllSubcategories({
        all: false,
        currentPage: 1,
        pageSize: 10,
      });
      // console.log("paginatedSubcategories", paginatedSubcategoriesResponse);
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
      showToast.error("Error fetching subcategories!");
    }
  };

  const getAllProducts = async () => {
    try {
      const allProducts = await fetchAllProducts({
        all: false,
        currentPage: 1,
        pageSize: 12,
      });
      // console.log("allProducts", allProducts);
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
      showToast.error("Error fetching products!");
    }
  };

  const getAllCartItems = async () => {
    try {
      const response = await fetchAllCartItems();
      // console.log("Cart Items:", response.data);

      if (response.status === apiSummary.endpoints.cart.getCart.successStatus) {
        dispatch(addToCart(response.data.data));
      }
    } catch (error) {
      console.error("Fetch Cart Items Error: ", error);
      showToast.error("Error fetching cart items!");
    }
  };

  const getAllAddresses = async () => {
    try {
      const response = await customAxios({
        url: apiSummary.endpoints.address.getAllAddresses.path,
        method: apiSummary.endpoints.address.getAllAddresses.method,
      });

      if (
        response.status ===
        apiSummary.endpoints.address.getAllAddresses.successStatus
      ) {
        // Handle the response data as needed
        // console.log("Addresses fetched successfully:", response.data.data);
        dispatch(setAddresses(response.data.data));
      }
    } catch (error) {
      console.error("Fetch Addresses Error: ", error);
      showToast.error("Error fetching addresses!");
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
      getAllCartItems();
      getAllAddresses();
    }
  }, [user]);

  // Redirect to home if user is logged in and on welcome page
  useEffect(() => {
    if (user?._id && location.pathname === "/") {
      navigate("/home");
    }
  }, [user, location.pathname]);

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-100">
      <Header />
      <main className="min-h-[calc(100vh-8rem)] pb-2">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
      <CustomToaster />
    </div>
  );
}

export default App;

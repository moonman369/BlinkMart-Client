import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
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
  setProductPageDetails,
  setSubcategoryPageDetails,
} from "./store/productSlice";
import { all } from "axios";
import { fetchAllSubcategories } from "./util/fetchAllSubcategories";
import { fetchAllProducts } from "./util/fetchAllProducts";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

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
        // currentPage: 1,
        // pageSize: 10,
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
      const allSubcategories = await fetchAllSubcategories({
        all: false,
        currentPage: 1,
        pageSize: 10,
      });
      console.log("allSubcategories", allSubcategories);
      dispatch(setAllSubcategories(allSubcategories?.data?.data));
      dispatch(
        setSubcategoryPageDetails({
          pageSize: allSubcategories?.data?.pageSize,
          currentPage: allSubcategories?.data?.currentPage,
          count: allSubcategories?.data?.count,
          totalCount: allSubcategories?.data?.totalCount,
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
    getUser();
  }, []);

  useEffect(() => {
    if (user && user?.role === "ADMIN") {
      getAllCategories();
      getAllSubcategories();
      getAllProducts();
    }
  }, [user]);

  // useEffect(() => {
  //   getAllProducts();
  // }, []);

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-8rem)] pb-12">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#d1d5db",
          },
        }}
      />
    </>
  );
}

export default App;

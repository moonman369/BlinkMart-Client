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
import { setAllCategories } from "./store/productSlice";

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
      const allCategories = await fetchAllCategories();
      console.log("allCategories", allCategories);
      dispatch(setAllCategories(allCategories?.data?.data));
    } catch (error) {
      console.error("Fetch Categories Error: ", error);
      toast.error("Error fetching categories!");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user && user?.role === "ADMIN") {
      getAllCategories();
    }
  }, [user]);

  return (
    <>
      <Header />
      <main className="min-h-[80vh]">
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

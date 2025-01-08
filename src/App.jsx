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
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  const getUser = async () => {
    const userData = await fetchUserDetails();
    console.log(userData);
    dispatch(setUserDetails(userData?.data?.data));
  };

  useEffect(() => {
    getUser();
  }, []);

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

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [count, setCount] = useState(0);

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

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";

createRoot(document.getElementById("root")).render(
  // `StrictMode` Loads components twice for dev purpose
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

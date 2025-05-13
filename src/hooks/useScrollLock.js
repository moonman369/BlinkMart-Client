import { useEffect } from "react";

const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (isLocked) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      // Add styles to prevent scrolling
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      // Get the scroll position from the body's top style
      const scrollY = document.body.style.top;
      // Remove the fixed positioning
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      // Restore the scroll position
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    // Cleanup function to ensure scroll is restored when component unmounts
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isLocked]);
};

export default useScrollLock;

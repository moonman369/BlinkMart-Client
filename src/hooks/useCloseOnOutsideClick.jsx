import React, { useEffect } from "react";

const useCloseOnOutsideClick = (refList, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on interactive elements
      if (
        event.target.tagName === "BUTTON" ||
        event.target.tagName === "A" ||
        event.target.closest("button") ||
        event.target.closest("a")
      ) {
        return;
      }

      let refExclusionCondition = true;
      for (let ref of refList) {
        if (ref.current && ref.current.contains(event.target)) {
          refExclusionCondition = false;
          break;
        }
      }

      if (refExclusionCondition) {
        callback(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [...refList, callback]);
};

export default useCloseOnOutsideClick;

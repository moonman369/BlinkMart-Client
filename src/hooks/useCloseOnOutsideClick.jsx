import React, { useEffect } from "react";

const useCloseOnOutsideClick = (refList, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      let refExclusionCondition;
      for (let ref of refList) {
        if (ref.current && !ref.current.contains(event.target)) {
          refExclusionCondition = true;
        } else {
          refExclusionCondition = false;
        }
      }
      if (refExclusionCondition) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [...refList, callback]);
};

export default useCloseOnOutsideClick;

import React, { useState, useEffect } from "react";
import { FaCookieBite } from "react-icons/fa";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if cookies are enabled
    if (!navigator.cookieEnabled) {
      setShowBanner(true);
      return;
    }

    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent || cookieConsent === "declined") {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    if (!navigator.cookieEnabled) {
      // If cookies are disabled, keep showing the banner
      return;
    }
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
    // Request cookie permissions
    document.cookie = "cookieConsent=true; path=/; max-age=31536000"; // 1 year
  };

  const handleDecline = () => {
    if (!navigator.cookieEnabled) {
      // If cookies are disabled, keep showing the banner
      return;
    }
    // Simply hide the banner without storing the preference
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FaCookieBite className="text-primary-200 text-2xl" />
          <div className="text-sm text-gray-300">
            <p>
              {!navigator.cookieEnabled
                ? "Please enable cookies in your browser to use this website properly."
                : "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking 'Accept All', you consent to our use of cookies."}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

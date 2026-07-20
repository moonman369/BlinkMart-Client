import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t bg-gray-900 fixed bottom-0 w-full hidden sm:block">
      <div className="py-2 px-4 mx-auto text-center flex flex-col lg:flex-row lg:justify-between gap-1">
        <p className="text-sm">© 2026 Ayan Maiti. All rights reserved.</p>

        <div className="flex items-center gap-4 justify-center text-xl">
          <a href="" className="hover:text-highlight-100">
            <FaFacebook />
          </a>
          <a href="" className="hover:text-highlight-100">
            <FaInstagram />
          </a>
          <a href="" className="hover:text-highlight-100">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

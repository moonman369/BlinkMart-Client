import React from "react";
import banner from "../assets/banner_cropped.JPG";
import bannerMobile from "../assets/banner-mobile_cropped.JPG";

const Home = () => {
  return (
    <section>
      <div className="container mx-auto">
        <div
          className={`min-h-48 w-full h-full bg-gray-700 rounded ${
            !banner && "animate-pulse my-2"
          }`}
        >
          <img
            src={banner}
            alt="banner"
            className="h-full w-full hidden lg:block"
          />
          <img
            src={bannerMobile}
            alt="banner-mobile"
            className="h-full w-full lg:hidden"
          />
        </div>
      </div>

      <div>
        <h2 className="container mx-auto px-4 my-2 font-bold text-lg">
          Shop By Category
        </h2>
      </div>
    </section>
  );
};

export default Home;

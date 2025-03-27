import React from "react";
import banner from "../assets/banner_cropped.JPG";
import bannerMobile from "../assets/banner-mobile_cropped.JPG";
import { useSelector } from "react-redux";

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categories = useSelector((state) => state.product.allCategories);
  return (
    <section>
      {/* <div className="container mx-auto">
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
      </div> */}
      <div className="container mx-auto">
        <div
          className={`w-full h-full min-h-48 bg-blue-100 rounded ${
            !banner && "animate-pulse my-2"
          } `}
        >
          <img
            src={banner}
            className="w-full h-full hidden lg:block"
            alt="banner"
          />
          <img
            src={bannerMobile}
            className="w-full h-full lg:hidden"
            alt="banner"
          />
        </div>
      </div>

      <div className="container mx-auto p-4 my-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {loadingCategory
          ? new Array(12).fill(null).map((_, index) => {
              return (
                <div
                  key={index + "loadingcategory"}
                  className=" rounded p-4 min-h-36 grid gap-2 shadow animate-pulse"
                >
                  <div className="bg-gray-700 min-h-24 rounded"></div>
                  <div className="bg-gray-700 h-8 rounded"></div>
                </div>
              );
            })
          : categories.map((category, index) => {
              return (
                <div
                  key={category._id + "displayCategory"}
                  className="w-full h-full object-scale-down"
                  // onClick={() =>
                  //   handleRedirectProductListpage(category._id, category.name)
                  // }
                >
                  <div>
                    <img
                      src={category.image}
                      className="w-full h-full object-scale-down"
                    />
                  </div>
                </div>
              );
            })}
      </div>
    </section>
  );
};

export default Home;

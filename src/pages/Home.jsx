import React, { useEffect, useState } from "react";
import banner from "../assets/banner_cropped.JPG";
import bannerMobile from "../assets/banner-mobile_cropped.JPG";
import { useSelector } from "react-redux";
import { fetchAllCategories } from "../util/fetchAllCategories";
import { fetchAllSubcategories } from "../util/fetchAllSubcategories";
import { Link, useNavigate } from "react-router-dom";
import { apiSummary } from "../config/api/apiSummary";
import DisplayProductsByCategory from "../components/DisplayProductsByCategory";
import { axiosToastError } from "../util/axiosToastError.js";
import { convertToUrlString } from "../util/convertToUrlString.js";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categories = useSelector((state) => state.product.allCategories);
  const subcategories = useSelector((state) => state.product.allSubcategories);
  const navigate = useNavigate();

  const handleRedirectProductCategorizedPage = (category) => {
    const categoryId = category?._id;
    const categoryName = category?.name;
    if (!categoryId || !categoryName) {
      console.error("Invalid category data:", category);
      return;
    }

    const subcategory = subcategories.find((subcategory) =>
      subcategory.category.some((cat) => cat._id === categoryId)
    );
    console.log("matchedSubcategories", subcategory);
    if (!subcategory) {
      console.error("No subcategory found for this categoryId:", categoryId);
      return;
    }

    const url = `/${convertToUrlString(
      categoryName
    )}-${categoryId}/${convertToUrlString(subcategory?.name)}-${
      subcategory?._id
    }`;
    console.log(url);
    navigate(url, {
      state: {
        category: category,
        subcategory: subcategory,
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchAllCategories({ all: true }),
          fetchAllSubcategories({ all: true }),
          // other fetch calls
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        axiosToastError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section>
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

      <div className="container mx-auto p-4 my-2 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-4">
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
                  className="w-full h-full object-scale-down rounded cursor-pointer"
                  onClick={() => {
                    handleRedirectProductCategorizedPage(category);
                  }}
                >
                  <div>
                    <img
                      src={category.image}
                      className="w-full object-scale-down rounded"
                    />
                  </div>
                </div>
              );
            })}
      </div>

      {categories.map((category, index) => {
        return (
          <DisplayProductsByCategory
            key={`${category?._id}-${category.name}`}
            id={category?._id}
            name={category?.name}
            handleRedirectToCategoryPage={handleRedirectProductCategorizedPage}
            category={category}
          />
        );
      })}
    </section>
  );
};

export default Home;

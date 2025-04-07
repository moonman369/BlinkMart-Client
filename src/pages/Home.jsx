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

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categories = useSelector((state) => state.product.allCategories);
  const [subcategories, setSubcategories] = useState([]);
  const navigate = useNavigate();

  const loadAllSubcategories = async () => {
    try {
      const fetchAllSubcategoriesResponse = await fetchAllSubcategories({
        all: true,
      });
      console.log(
        "fetchAllSubcategoriesResponse",
        fetchAllSubcategoriesResponse
      );
      if (
        fetchAllSubcategoriesResponse?.status ===
        apiSummary.endpoints.subcategory.getAllSubcategories.successStatus
      ) {
        setSubcategories(fetchAllSubcategoriesResponse?.data?.data);
      }
    } catch (error) {
      console.error(error);
      axiosToastError(error);
    }
  };
  useEffect(() => {
    loadAllSubcategories();
  }, []);

  const handleRedirectProductCategorizedPage = (categoryId, categoryName) => {
    const subcategory = subcategories.find((sub) => {
      const filterData = sub.category.some((c) => {
        return c._id == categoryId;
      });
      return filterData ? true : null;
    });

    const url = `/${convertToUrlString(
      categoryName
    )}-${categoryId}/${convertToUrlString(subcategory?.name)}-${
      subcategory?._id
    }`;
    console.log(url);
    navigate(url, {
      state: {
        categoryId: categoryId,
        subcategoryId: subcategory?._id,
      },
    });
  };

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
                    handleRedirectProductCategorizedPage(
                      category._id,
                      category.name
                    );
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
          />
        );
      })}
    </section>
  );
};

export default Home;

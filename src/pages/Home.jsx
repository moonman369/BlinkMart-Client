import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Skeleton from "../components/ui/Skeleton";
import banner from "../assets/banner_cropped.JPG";
import bannerMobile from "../assets/banner-mobile_cropped.JPG";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "../util/fetchAllCategories";
import { fetchAllSubcategories } from "../util/fetchAllSubcategories";
import { Link, useNavigate } from "react-router-dom";
import { apiSummary } from "../config/api/apiSummary";
import DisplayProductsByCategory from "../components/DisplayProductsByCategory";
import { axiosToastError } from "../util/axiosToastError.js";
import { buildProductCategorizedUrl } from "../util/buildProductCategorizedUrl.js";
import { setLoadingCategory } from "../store/productSlice.js";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categories = useSelector((state) => state.product.allCategories);
  const subcategories = useSelector((state) => state.product.allSubcategories);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

    const url = buildProductCategorizedUrl(category, subcategory);
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
        if (user?._id) {
          setLoading(true);
          await Promise.all([
            fetchAllCategories({ all: true }),
            fetchAllSubcategories({ all: true }),
            // other fetch calls
          ]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // axiosToastError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Skeletons mirroring the real layout keep the page from collapsing to a
  // spinner and back, which is the main source of perceived jank on load.
  if (loading) {
    return (
      <section className="pb-4">
        <div className="container mx-auto px-3 pt-3">
          <Skeleton className="h-40 w-full lg:h-64" rounded="rounded-sheet" />
        </div>
        <div className="container mx-auto grid grid-cols-3 gap-3 px-3 py-6 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {new Array(8).fill(null).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 rounded-card border border-surface-border bg-surface-raised p-3"
            >
              <Skeleton className="aspect-square w-full" rounded="rounded-xl" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="pb-4">
      {/* Banner */}
      <div className="container mx-auto px-3 pt-3">
        <div className="w-full overflow-hidden rounded-sheet border border-surface-border bg-surface-raised shadow-e2">
          <img
            src={banner}
            className="hidden h-full w-full object-cover lg:block"
            alt="Seasonal offers"
          />
          <img
            src={bannerMobile}
            className="h-full w-full object-cover lg:hidden"
            alt="Seasonal offers"
          />
        </div>
      </div>

      {/* Category rail */}
      <div className="container mx-auto grid grid-cols-3 gap-3 px-3 py-6 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {loadingCategory
          ? new Array(12).fill(null).map((_, index) => (
              <div
                key={index + "loadingcategory"}
                className="flex flex-col items-center gap-2 rounded-card border border-surface-border bg-surface-raised p-3"
              >
                <Skeleton className="aspect-square w-full" rounded="rounded-xl" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))
          : categories.map((category, index) => (
              <motion.button
                key={category._id + "displayCategory"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                  delay: Math.min(index * 0.03, 0.3),
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRedirectProductCategorizedPage(category)}
                className="group flex flex-col items-center gap-2 rounded-card border border-surface-border bg-surface-raised p-3 transition-all duration-base ease-out hover:-translate-y-1 hover:border-brand-500/50 hover:shadow-e2"
              >
                <div className="aspect-square w-full overflow-hidden rounded-xl">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-slow ease-out group-hover:scale-110"
                  />
                </div>
                <p className="line-clamp-1 text-center text-2xs font-semibold text-ink-secondary transition-colors group-hover:text-ink-primary lg:text-xs">
                  {category.name}
                </p>
              </motion.button>
            ))}
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

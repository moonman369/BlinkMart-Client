import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchProductsBySubcategory } from "../util/fetchAllProducts";
import { axiosToastError } from "../util/axiosToastError";
import { apiSummary } from "../config/api/apiSummary";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";
import { useSelector } from "react-redux";
import { fetchSubcategoriesByCategory } from "../util/fetchAllSubcategories";
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { convertToUrlString } from "../util/convertToUrlString";

const ProductCategorized = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, subcategory } = location.state || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categorySubcategories, setCategorySubcategories] = useState([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const allSubcategories = useSelector(
    (state) => state.product.allSubcategories
  );
  const mobileMenuRef = useRef(null);

  console.log("allSubcategories", allSubcategories);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const loadSubcategoriesByCategory = async () => {
    try {
      setLoadingSubcategories(true);
      const response = await fetchSubcategoriesByCategory({
        categoryId: category?._id,
        all: true,
      });
      if (
        response.status ===
        apiSummary.endpoints.subcategory.getAllSubcategories.successStatus
      ) {
        setCategorySubcategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      axiosToastError(error);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  useEffect(() => {
    if (category?._id) {
      loadSubcategoriesByCategory();
    }
  }, [category?._id]);

  const loadProductsSubcategorywise = async () => {
    try {
      setLoading(true);
      const productResponse = await fetchProductsBySubcategory({
        subcategoryId: subcategory?._id,
        currentPage: currentPage,
        pageSize: 20,
      });
      if (
        productResponse.status ===
        apiSummary.endpoints.product.getProductsBySubategory.successStatus
      ) {
        setProducts(productResponse.data.data);
      }
    } catch (error) {
      console.error(error);
      // axiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductsSubcategorywise();
  }, [currentPage, subcategory?._id]);

  console.log("products", products);
  console.log("location.state", location.state);

  const handleSubcategoryClick = (selectedSubcategory) => {
    const url = `/${convertToUrlString(category.name)}-${
      category._id
    }/${convertToUrlString(selectedSubcategory.name)}-${
      selectedSubcategory._id
    }`;
    navigate(url, {
      state: {
        category: category,
        subcategory: selectedSubcategory,
      },
    });
    setIsMobileMenuOpen(false);
  };

  return (
    <section className="sticky top-24 lg:top-20">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-[200px,1fr] lg:grid-cols-[300px,1fr]">
        {/* Desktop Subcategories Sidebar */}
        <div className="hidden md:block h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide bg-black rounded-lg">
          <div className="sticky top-0 bg-black shadow-green-700 shadow-md p-2 rounded-t-lg z-10">
            <h3 className="font-semibold text-lg">Subcategories</h3>
          </div>
          <div className="flex flex-col gap-2 p-4">
            {loadingSubcategories ? (
              <LoadingSpinner />
            ) : categorySubcategories && categorySubcategories.length > 0 ? (
              categorySubcategories.map((sub) => (
                <div
                  key={sub._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-800 flex items-center gap-3 ${
                    sub._id === subcategory?._id ? "bg-green-900" : ""
                  }`}
                  onClick={() => handleSubcategoryClick(sub)}
                >
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                  <span>{sub.name}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-400 p-3">No subcategories found</div>
            )}
          </div>
        </div>

        {/* products */}
        <div className="h-[calc(100vh-6rem)] overflow-y-auto ml-0 md:ml-4">
          <div className="shadow-green-700 shadow-md p-4 rounded-lg bg-gray-900 mt-4 mx-4 md:mx-0">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-xl">{subcategory.name}</h3>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-2xl text-white hover:text-gray-300"
              >
                <IoMenu />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 w-full md:grid-cols-3 lg:grid-cols-4 gap-4 p-2 my-4 max-w-[90%] mx-auto md:max-w-none md:mx-0">
            {loading && <LoadingSpinner />}

            {products.map((product, index) => (
              <ProductCard
                key={`product-${product?._id}-${index}`}
                product={product}
                category={category}
                subcategory={subcategory}
                setCurrentPage={setCurrentPage}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Subcategories Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 pt-24 pb-20">
          <div
            ref={mobileMenuRef}
            className="bg-black h-[calc(100vh-11rem)] w-[80%] max-w-[300px] overflow-y-auto mx-auto"
          >
            <div className="sticky top-0 bg-black shadow-green-700 shadow-md p-4 rounded-t-lg z-10 flex justify-between items-center">
              <h3 className="font-semibold text-xl text-white">
                Subcategories
              </h3>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-red-500 hover:text-red-400 text-2xl"
              >
                <IoClose />
              </button>
            </div>
            <div className="flex flex-col gap-2 p-4">
              {loadingSubcategories ? (
                <LoadingSpinner />
              ) : categorySubcategories && categorySubcategories.length > 0 ? (
                categorySubcategories.map((sub) => (
                  <div
                    key={sub._id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-800 flex items-center gap-3 ${
                      sub._id === subcategory?._id ? "bg-green-900" : ""
                    }`}
                    onClick={() => handleSubcategoryClick(sub)}
                  >
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <span>{sub.name}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 p-3">No subcategories found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductCategorized;

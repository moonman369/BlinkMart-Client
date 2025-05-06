import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchProductsBySubcategory } from "../util/fetchAllProducts";
import { axiosToastError } from "../util/axiosToastError";
import { apiSummary } from "../config/api/apiSummary";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";
import { useSelector } from "react-redux";
import { fetchSubcategoriesByCategory } from "../util/fetchAllSubcategories";

const ProductCategorized = () => {
  const location = useLocation();
  const { category, subcategory } = location.state || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categorySubcategories, setCategorySubcategories] = useState([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const allSubcategories = useSelector((state) => state.product.allSubcategories);

  console.log("allSubcategories", allSubcategories);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const loadSubcategoriesByCategory = async () => {
    try {
      setLoadingSubcategories(true);
      const response = await fetchSubcategoriesByCategory({
        categoryId: category?._id,
        all: true,
      });
      if (response.status === apiSummary.endpoints.subcategory.getAllSubcategories.successStatus) {
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
  }, [currentPage]);

  console.log("products", products);
  console.log("location.state", location.state);
  return (
    <section className="sticky top-24 lg:top-20">
      <div className="container mx-auto grid grid-cols-[100px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[300px,1fr]">
        {/* subcategories */}
        <div className="h-[calc(100vh-10rem)] overflow-y-auto scrollbar-hide bg-black rounded-lg p-4">
          <div className="sticky top-0 bg-black shadow-green-700 shadow-md p-2 mb-4 rounded z-10">
            <h3 className="font-semibold text-lg">Subcategories</h3>
          </div>
          <div className="flex flex-col gap-2">
            {loadingSubcategories ? (
              <LoadingSpinner />
            ) : categorySubcategories && categorySubcategories.length > 0 ? (
              categorySubcategories.map((sub) => (
                <div
                  key={sub._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-800 ${
                    sub._id === subcategory?._id ? "bg-gray-800" : ""
                  }`}
                >
                  {sub.name}
                </div>
              ))
            ) : (
              <div className="text-gray-400 p-3">No subcategories found</div>
            )}
          </div>
        </div>

        {/* products */}
        <div className="overflow-y-auto">
          <div className="shadow-green-700 shadow-md p-2">
            <h3 className="font-semibold">{subcategory.name}</h3>
          </div>
          <div className="grid grid-cols-2 w-full md:grid-cols-3 lg:grid-cols-4 gap-4 p-2 my-4">
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
    </section>
  );
};

export default ProductCategorized;

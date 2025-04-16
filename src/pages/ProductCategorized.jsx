import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchProductsBySubcategory } from "../util/fetchAllProducts";
import { axiosToastError } from "../util/axiosToastError";
import { apiSummary } from "../config/api/apiSummary";

const ProductCategorized = () => {
  const location = useLocation();
  const { categoryId, subcategoryId } = location.state || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadProductsSubcategorywise = async () => {
    try {
      setLoading(true);
      const productResponse = await fetchProductsBySubcategory({
        subcategoryId: subcategoryId,
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
      axiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadProductsSubcategorywise();
  }, [currentPage]);

  console.log("products", products);
  return (
    <section className="sticky top-24 lg:top-20">
      <div className="container mx-auto grid grid-cols-[100px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[300px,1fr]">
        {/* subcategories */}
        <div className=" h-full min-h-[90vh] lg:min-h-[80vh]">sub</div>

        {/* products */}
        <div className="">prod</div>
      </div>
    </section>
  );
};

export default ProductCategorized;

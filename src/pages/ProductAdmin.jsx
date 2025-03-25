import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../util/fetchAllProducts";
import { apiSummary } from "../config/api/apiSummary";
import { setAllProducts, setProductPageDetails } from "../store/productSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCardAdmin from "../components/ProductCardAdmin";
import PaginationBar from "../components/PaginationBar";

const ProductAdmin = () => {
  const products = useSelector((state) => state.product.allProducts);
  const productPageDetails = useSelector(
    (state) => state.product.pageDetails.products
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const refreshProducts = async (currentPage, pageSize) => {
    try {
      setLoading(true);
      const fetchProductsResponse = await fetchAllProducts({
        all: false,
        currentPage,
        pageSize,
      });
      console.log(fetchProductsResponse);
      if (
        fetchProductsResponse.status ===
        apiSummary.endpoints.product.getProducts.successStatus
      ) {
        console.log("Refresh Products", fetchProductsResponse);
        dispatch(setAllProducts(fetchProductsResponse.data.data));
        dispatch(
          setProductPageDetails({
            pageSize: fetchProductsResponse?.data?.pageSize,
            currentPage: fetchProductsResponse?.data?.currentPage,
            count: fetchProductsResponse?.data?.count,
            totalCount: fetchProductsResponse?.data?.totalCount,
          })
        );
      }
    } catch (error) {
      console.error("Fetch Products Error: ", error);
      axiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="p-3 font-semibold bg-gray-900 shadow-secondary-200 shadow-md rounded-md flex items-center justify-between">
        <h2 className="text-[20px]">Products</h2>
      </div>

      {loading && <LoadingSpinner />}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 p-8">
        {products.map((product, index) => {
          return <ProductCardAdmin data={product} key={index} />;
        })}
      </div>

      <PaginationBar
        styles={"mt-10"}
        pageSize={12}
        totalPages={Math.ceil(productPageDetails?.totalCount / 12)}
        reloadPage={refreshProducts}
      />
    </section>
  );
};

export default ProductAdmin;

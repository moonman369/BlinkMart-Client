import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../util/fetchAllProducts";
import { apiSummary } from "../config/api/apiSummary";
import { setAllProducts, setProductPageDetails } from "../store/productSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCardAdmin from "../components/ProductCardAdmin";
import PaginationBar from "../components/PaginationBar";
import { IoSearch } from "react-icons/io5";
import { BiHandicap } from "react-icons/bi";

const ProductAdmin = () => {
  const products = useSelector((state) => state.product.allProducts);
  const productPageDetails = useSelector(
    (state) => state.product.pageDetails.products
  );
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearchPage, setSearchCurrentPage] = useState(1);
  const dispatch = useDispatch();

  const refreshProducts = async (currentPage, pageSize, searchText) => {
    try {
      setLoading(true);
      const fetchProductsResponse = await fetchAllProducts({
        all: false,
        currentPage,
        pageSize,
        searchText,
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

  useEffect(() => {
    if (!products || products.length <= 0) {
      refreshProducts(currentPage, 12);
    }
  }, []);

  useEffect(() => {
    if (!searchText || searchText === "") {
      refreshProducts(currentPage, 12);
      setSearchCurrentPage(1);
    }
  }, [searchText]);

  const handleSearchTextChange = (e) => {
    e.preventDefault();
    setSearchText(e.target.value);
  };

  const handleSearchBarEnterPress = async (e) => {
    if (e.key === "Enter") {
      await refreshProducts(currentSearchPage, 12, searchText);
    }
  };

  return (
    <section>
      <div className="p-3 font-semibold bg-gray-900 shadow-secondary-200 shadow-md rounded-md flex items-center justify-between">
        <h2 className="text-[20px]">Products</h2>
        <div
          className="text-neutral-400 px-2 bg-gray-700 focus-within:border-primary-200 rounded border overflow-hidden flex items-center w-[200px] lg:w-150"
          onKeyUp={handleSearchBarEnterPress}
        >
          <IoSearch />
          <input
            type="text"
            placeholder="Admin Product Search"
            className="bg-gray-700 px-4 py-1 h-full outline-none"
            onChange={handleSearchTextChange}
          />
        </div>
      </div>

      {loading && <LoadingSpinner />}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 p-8">
        {products.map((product, index) => {
          return <ProductCardAdmin data={product} key={index} />;
        })}
      </div>

      <PaginationBar
        styles={"mt-10"}
        currentPage={searchText ? currentSearchPage : currentPage}
        setCurrentPage={searchText ? setSearchCurrentPage : setCurrentPage}
        pageSize={12}
        totalPages={Math.ceil(productPageDetails?.totalCount / 12)}
        reloadPage={refreshProducts}
      />
    </section>
  );
};

export default ProductAdmin;

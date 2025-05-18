import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingBag, FaTags, FaHistory } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { clearRecentSearches, setSearchQuery } from "../store/searchSlice";
import { fetchAllProducts } from "../util/fetchAllProducts";
import { apiSummary } from "../config/api/apiSummary";
import { axiosToastError } from "../util/axiosToastError";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";
import NoData from "../components/NoData";
import PaginationBar from "../components/PaginationBar";

const SearchPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchQuery, recentSearches } = useSelector((state) => state.search);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showWelcome, setShowWelcome] = useState(true);
  const [pageDetails, setPageDetails] = useState({
    pageSize: 12,
    currentPage: 1,
    count: 0,
    totalCount: 0,
  });

  const handleClearRecentSearches = () => {
    dispatch(clearRecentSearches());
  };

  const navigateToHome = () => {
    navigate("/");
  };

  const handleRecentSearchClick = (search) => {
    dispatch(setSearchQuery(search));
    setCurrentPage(1);
  };

  const loadSearchResults = async () => {
    if (!searchQuery.trim()) {
      setShowWelcome(true);
      setProducts([]);
      return;
    }

    setShowWelcome(false);
    setLoading(true);
    try {
      const response = await fetchAllProducts({
        all: false,
        currentPage,
        pageSize: 12,
        searchText: searchQuery,
      });

      if (
        response.status ===
        apiSummary.endpoints.product.getProducts.successStatus
      ) {
        setProducts(response.data.data);
        setPageDetails({
          pageSize: response.data.pageSize,
          currentPage: response.data.currentPage,
          count: response.data.count,
          totalCount: response.data.totalCount,
        });
      }
    } catch (error) {
      console.error("Search Products Error: ", error);
      axiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery && searchQuery !== "") {
      loadSearchResults();
    } else {
      setShowWelcome(true);
    }
  }, [searchQuery, currentPage]);

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-800 p-4">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        {showWelcome ? (
          <div className="mt-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to BlinkMart Search
              </h2>
              <p className="text-gray-400">
                Find your favorite products quickly and easily
              </p>
            </div>

            {/* Quick Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div
                onClick={navigateToHome}
                className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <FaShoppingBag className="text-green-500 text-2xl mx-auto mb-2" />
                <span className="text-white">Groceries</span>
              </div>
              <div
                onClick={navigateToHome}
                className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <FaTags className="text-green-500 text-2xl mx-auto mb-2" />
                <span className="text-white">Deals</span>
              </div>
              <div
                onClick={navigateToHome}
                className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <FaShoppingBag className="text-green-500 text-2xl mx-auto mb-2" />
                <span className="text-white">New Arrivals</span>
              </div>
              <div
                onClick={navigateToHome}
                className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <FaTags className="text-green-500 text-2xl mx-auto mb-2" />
                <span className="text-white">Categories</span>
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <FaHistory className="text-green-500" />
                    Recent Searches
                  </h3>
                  <button
                    onClick={handleClearRecentSearches}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 hover:bg-gray-600 rounded cursor-pointer"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      <FaHistory className="text-gray-400" />
                      <span className="text-white">{search}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center md:text-left">
              Search Results for "{searchQuery}"
            </h2>

            {loading ? (
              <LoadingSpinner />
            ) : products.length > 0 ? (
              <>
                <div className="flex justify-center">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-[800px]">
                    {products.map((product, index) => (
                      <div key={`${product._id}-${index}`} className="w-full">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center mt-10">
                  <PaginationBar
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageSize={pageDetails.pageSize}
                    totalPages={Math.ceil(
                      pageDetails.totalCount / pageDetails.pageSize
                    )}
                    reloadPage={loadSearchResults}
                  />
                </div>
              </>
            ) : (
              <NoData message="No products found matching your search" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { fetchProductsById } from "../util/fetchAllProducts";
import LoadingSpinner from "../components/LoadingSpinner";
import NoData from "../components/NoData";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import {
  FaTag,
  FaBox,
  FaLayerGroup,
  FaShoppingCart,
  FaPercent,
  FaInfoCircle,
  FaTruck,
  FaBolt,
} from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import AddToCartButton from "../components/AddToCartButton";
import { useSelector } from "react-redux";

const ProductDisplay = () => {
  const location = useLocation();
  const { productId } = location.state || {};
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [moreDetails, setMoreDetails] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [cartItem, setCartItem] = useState({});
  const cartItems = useSelector((state) => state.cart?.items);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    loadProduct();
  }, []);

  useEffect(() => {
    if (cartItems && cartItems.length > 0 && product) {
      const item = cartItems.find((item) => item.product._id === product._id);
      if (item) {
        setCartItem(item);
      } else {
        setCartItem({});
      }
    } else {
      setCartItem({});
    }
  }, [cartItems, product]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextImage();
    }
    if (isRightSwipe) {
      handlePreviousImage();
    }
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productResponse = await fetchProductsById({ productId });
      console.log("productId", productId);
      console.log("productResponse", productResponse);
      if (productResponse?.data?.data) {
        setProduct(productResponse.data.data);
        // Parse more_details if it exists
        if (productResponse.data.data.more_details) {
          try {
            const parsedDetails =
              typeof productResponse.data.data.more_details === "string"
                ? JSON.parse(productResponse.data.data.more_details)
                : productResponse.data.data.more_details;
            setMoreDetails(parsedDetails);
          } catch (error) {
            console.error("Error parsing more_details:", error);
            setMoreDetails(null);
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product?.image.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product?.image.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const getVisibleThumbnails = () => {
    if (!product?.image) return [];

    const maxVisible = isMobile ? 3 : 5;
    const totalImages = product.image.length;

    if (totalImages <= maxVisible) {
      return product.image.map((img, idx) => ({ img, idx }));
    }

    let startIndex = Math.max(
      0,
      Math.min(
        currentImageIndex - Math.floor(maxVisible / 2),
        totalImages - maxVisible
      )
    );

    // Ensure the current image's thumbnail is always visible
    if (currentImageIndex < startIndex) {
      startIndex = currentImageIndex;
    } else if (currentImageIndex >= startIndex + maxVisible) {
      startIndex = currentImageIndex - maxVisible + 1;
    }

    return product.image
      .slice(startIndex, startIndex + maxVisible)
      .map((img, idx) => ({ img, idx: startIndex + idx }));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Loading */}
          <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-center">
            <div className="w-3/4 h-64 bg-gray-700 rounded-lg animate-pulse"></div>
          </div>

          {/* Product Details Loading */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="h-8 bg-gray-700 rounded w-3/4 mb-4 animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-700 rounded w-1/2 animate-pulse"></div>
              <div className="h-6 bg-gray-700 rounded w-1/3 animate-pulse"></div>
              <div className="h-6 bg-gray-700 rounded w-1/4 animate-pulse"></div>
              <div className="h-6 bg-gray-700 rounded w-1/2 animate-pulse"></div>
              <div className="h-6 bg-gray-700 rounded w-1/3 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!productId || !product) {
    return <NoData />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image Slideshow */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="relative">
            {/* Main Image */}
            <div
              ref={imageContainerRef}
              className="relative h-[400px] flex items-center justify-center"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <img
                src={product?.image[currentImageIndex]}
                alt={`${product?.name} - Image ${currentImageIndex + 1}`}
                className="max-h-full max-w-full object-contain rounded-lg select-none"
                draggable="false"
              />

              {/* Navigation Buttons */}
              {product?.image.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200 hidden md:block"
                  >
                    <IoChevronBack size={24} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200 hidden md:block"
                  >
                    <IoChevronForward size={24} />
                  </button>
                </>
              )}

              {/* Image Position Indicators - Mobile Only */}
              {product?.image.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
                  {product.image.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        currentImageIndex === index
                          ? "bg-green-500 scale-125"
                          : "bg-gray-400 hover:bg-gray-300"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Image Position Indicators - Desktop Only */}
            {product?.image.length > 1 && (
              <div className="hidden md:flex justify-center gap-2 my-4">
                {product.image.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      currentImageIndex === index
                        ? "bg-green-500 scale-110"
                        : "bg-gray-400 hover:bg-gray-300"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnails */}
            {product?.image.length > 1 && (
              <div className="flex justify-center mt-4">
                <div className="flex gap-2 overflow-x-auto pb-2 max-w-full">
                  {getVisibleThumbnails().map(({ img, idx }) => (
                    <button
                      key={idx}
                      onClick={() => handleThumbnailClick(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                        currentImageIndex === idx
                          ? "border-[3px] border-green-500"
                          : "border-2 border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover select-none"
                        draggable="false"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-gray-800 p-6 rounded-lg mb-7">
          <h1 className="text-2xl font-bold mb-6 text-white">
            {product?.name}
          </h1>

          <div className="space-y-6">
            {/* Category and Subcategory */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg">
                <FaLayerGroup className="text-green-500" />
                <div>
                  <span className="text-gray-400 text-sm">Category</span>
                  <p className="text-white font-medium">
                    {product?.category_id[0]?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg">
                <FaBox className="text-green-500" />
                <div>
                  <span className="text-gray-400 text-sm">Subcategory</span>
                  <p className="text-white font-medium">
                    {product?.sub_category_id[0]?.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Unit */}
            <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg">
              <FaTag className="text-green-500" />
              <div>
                <span className="text-gray-400 text-sm">Unit</span>
                <p className="text-white font-medium">{product?.unit}</p>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FaIndianRupeeSign className="text-green-500" />
                  <span className="text-gray-400">Price</span>
                </div>
                {product?.discount > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-yellow-400 line-through">
                      ₹{product?.price}
                    </span>
                    <span className="text-2xl font-bold text-green-500">
                      ₹
                      {(
                        (product?.price * (100 - product?.discount)) /
                        100
                      ).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-green-500">
                    ₹{product?.price}
                  </span>
                )}
              </div>

              {product?.discount > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaPercent className="text-red-500" />
                      <span className="text-gray-400">Discount</span>
                    </div>
                    <span className="text-lg font-semibold text-red-500">
                      {product?.discount}% OFF
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Time */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FaTruck className="text-green-500" />
                <span className="text-gray-400">Delivery Time</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <span className="text-white text-sm md:text-base">
                    Estimated Delivery
                  </span>
                  <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full w-fit">
                    <span className="text-green-500 font-medium text-sm md:text-base whitespace-nowrap">
                      10 min
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full w-fit">
                  <FaBolt className="text-sm" />
                  <span className="text-sm font-medium">Superfast</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {product?.description && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FaInfoCircle className="text-green-500" />
                  <h2 className="text-lg font-semibold text-white">
                    Description
                  </h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {product?.description}
                </p>
              </div>
            )}

            {/* Additional Details */}
            {moreDetails && Object.keys(moreDetails).length > 0 && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FaInfoCircle className="text-green-500" />
                  <h2 className="text-lg font-semibold text-white">
                    Additional Details
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(moreDetails).map(([key, value]) => (
                    <div key={key} className="bg-gray-800 p-3 rounded-lg">
                      <span className="text-gray-400 text-sm capitalize block mb-1">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-white">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <AddToCartButton
              product={product}
              cartItem={cartItem}
              productDisplayPage={true}
            />
            {/* <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
              <FaShoppingCart />
              Add to Cart
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;

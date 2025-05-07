import React from "react";
import { useLocation } from "react-router-dom";

const ProductDisplay = () => {
  const location = useLocation();
  const { product, category, subcategory } = location.state || {};

  if (!product) {
    return <div className="container mx-auto p-4">Product not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-center">
          <img
            src={product.image[0]}
            alt={product.name}
            className="w-3/4 h-auto object-contain rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

          <div className="mb-4">
            <span className="text-gray-400">Category: </span>
            <span>{category?.name}</span>
          </div>

          <div className="mb-4">
            <span className="text-gray-400">Subcategory: </span>
            <span>{subcategory?.name}</span>
          </div>

          <div className="mb-4">
            <span className="text-gray-400">Unit: </span>
            <span>{product.unit}</span>
          </div>

          <div className="mb-4">
            <span className="text-gray-400">Price: </span>
            <span className="text-xl font-bold text-green-500">
              ₹{product.price}
            </span>
          </div>

          {product.description && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-300">{product.description}</p>
            </div>
          )}

          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;

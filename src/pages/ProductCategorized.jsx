import React from "react";
import { useLocation } from "react-router-dom";

const ProductCategorized = () => {
  const location = useLocation();
  const { categoryId, subcategoryId } = location.state || {};
  // console.log("categoryId", categoryId);
  // console.log("subcategoryId", subcategoryId);
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

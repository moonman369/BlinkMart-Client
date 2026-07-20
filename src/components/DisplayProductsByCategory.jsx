import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { axiosToastError } from "../util/axiosToastError.js";
import { fetchProductsByCategory } from "../util/fetchAllProducts.js";
import { apiSummary } from "../config/api/apiSummary.js";
import ProductCard from "./ProductCard.jsx";
import { ProductCardSkeleton } from "./ui/Skeleton.jsx";
import { cn } from "../util/cn.js";

const SCROLL_STEP = 320;

const DisplayProductsByCategory = ({
  id,
  name,
  category,
  handleRedirectToCategoryPage,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const loadProductsByCategory = async () => {
      setLoading(true);
      try {
        const productResponse = await fetchProductsByCategory({
          categoryId: id,
          pageSize: 20,
          currentPage: 1,
        });

        if (
          productResponse.status ===
          apiSummary.endpoints.product.getProductsByCategory.successStatus
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

    loadProductsByCategory();
  }, [id]);

  // Arrows are only shown when there's actually somewhere to scroll, so they
  // don't sit there inert at the ends of the rail.
  const updateScrollAffordances = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollAffordances();
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollAffordances, { passive: true });
    window.addEventListener("resize", updateScrollAffordances);
    return () => {
      el.removeEventListener("scroll", updateScrollAffordances);
      window.removeEventListener("resize", updateScrollAffordances);
    };
  }, [products, updateScrollAffordances]);

  const scrollBy = (delta) =>
    containerRef.current?.scrollBy({ left: delta, behavior: "smooth" });

  const hasProducts = products.length > 0;

  return (
    <section className="container mx-auto px-3 py-4">
      <header className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-base font-bold text-ink-primary lg:text-xl">
          {name}
        </h2>
        {hasProducts && (
          <button
            onClick={() => handleRedirectToCategoryPage(category)}
            className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold text-mint-400 transition-colors hover:bg-mint-600/10 hover:text-mint-300 lg:text-sm"
          >
            See all
          </button>
        )}
      </header>

      <div className="group/rail relative">
        <div
          ref={containerRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 lg:gap-4"
        >
          {loading
            ? new Array(6).fill(null).map((_, i) => (
                <div
                  key={`Prod-Loading-${i}`}
                  className="w-[150px] shrink-0 lg:w-[200px]"
                >
                  <ProductCardSkeleton />
                </div>
              ))
            : products.map((product, i) => (
                <div
                  key={`${product._id}-Prod-${i}`}
                  className="w-[150px] shrink-0 snap-start lg:w-[200px]"
                >
                  <ProductCard product={product} index={i} />
                </div>
              ))}

          {!loading && !hasProducts && (
            <div className="flex h-40 w-full items-center justify-center rounded-card border border-dashed border-surface-border">
              <p className="text-sm text-ink-muted">
                No products available in this category
              </p>
            </div>
          )}
        </div>

        {/* Desktop scroll arrows — fade in on rail hover */}
        <RailArrow
          side="left"
          visible={canScrollLeft}
          onClick={() => scrollBy(-SCROLL_STEP)}
        />
        <RailArrow
          side="right"
          visible={canScrollRight}
          onClick={() => scrollBy(SCROLL_STEP)}
        />
      </div>
    </section>
  );
};

const RailArrow = ({ side, visible, onClick }) => {
  if (!visible) return null;
  const isLeft = side === "left";

  return (
    <button
      onClick={onClick}
      aria-label={isLeft ? "Scroll left" : "Scroll right"}
      className={cn(
        "absolute top-1/2 hidden -translate-y-1/2 rounded-full p-2.5 lg:flex",
        "border border-surface-border bg-surface-overlay/90 text-ink-primary shadow-e3 backdrop-blur-md",
        "opacity-0 transition-all duration-base ease-out group-hover/rail:opacity-100",
        "hover:border-mint-600/60 hover:text-mint-400",
        isLeft ? "-left-3" : "-right-3"
      )}
    >
      {isLeft ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
    </button>
  );
};

export default DisplayProductsByCategory;

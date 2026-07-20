import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { MdOutlineTimer } from "react-icons/md";
import { getINRString } from "../util/getINRString.js";
import { getDiscountedPrice } from "../util/price.js";
import { convertToUrlString } from "../util/convertToUrlString.js";
import AddToCartButton from "./AddToCartButton.jsx";
import { cn } from "../util/cn.js";

const ProductCard = ({ product, index = 0 }) => {
  const cartItems = useSelector((state) => state.cart?.items);

  const cartItem = useMemo(
    () => cartItems?.find((item) => item?.product?._id === product?._id),
    [cartItems, product?._id]
  );

  const url = `/product/${convertToUrlString(product?.name)}-${product?._id}`;

  const hasDiscount = product?.discount > 0;
  const effectivePrice = getDiscountedPrice(product?.price, product?.discount);
  const outOfStock = !(product?.stock > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.32,
        ease: [0.16, 1, 0.3, 1],
        // Cascade cards in rather than snapping the whole grid at once
        delay: Math.min(index * 0.035, 0.25),
      }}
    >
      <Link
        to={url}
        state={{ productId: product?._id }}
        className={cn(
          "group flex h-full flex-col gap-2 rounded-card border border-surface-border bg-surface-raised p-2.5 lg:p-3",
          "transition-all duration-base ease-out",
          "hover:-translate-y-1 hover:border-mint-600/50 hover:shadow-e3"
        )}
      >
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-hover/50">
          <img
            src={product?.image?.[0]}
            alt={product?.name}
            loading="lazy"
            className={cn(
              "h-full w-full object-contain p-2 transition-transform duration-slow ease-out",
              "group-hover:scale-[1.08]",
              outOfStock && "opacity-40 grayscale"
            )}
          />

          {hasDiscount && !outOfStock && (
            <div className="absolute left-1.5 top-1.5 rounded-md bg-brand-500 px-1.5 py-0.5 text-2xs font-extrabold text-surface-base shadow-e1">
              {product.discount}% OFF
            </div>
          )}

          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-base/60 backdrop-blur-[1px]">
              <span className="rounded-md bg-surface-overlay px-2 py-1 text-2xs font-bold uppercase tracking-wide text-ink-secondary">
                Out of stock
              </span>
            </div>
          )}
        </div>

        {/* Delivery ETA */}
        <div className="flex w-fit items-center gap-1 rounded-md bg-mint-600/10 px-1.5 py-0.5 text-2xs font-semibold text-mint-400">
          <MdOutlineTimer size={11} />
          10 MINS
        </div>

        {/* Name + unit */}
        <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-ink-primary lg:text-sm">
          {product?.name}
        </h3>
        <p className="text-2xs text-ink-muted lg:text-xs">{product?.unit}</p>

        {/* Price + action */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="min-w-0">
            <p className="text-sm font-bold text-ink-primary lg:text-base">
              {getINRString(effectivePrice)}
            </p>
            {hasDiscount && (
              <p className="text-2xs text-ink-faint line-through lg:text-xs">
                {getINRString(product.price)}
              </p>
            )}
          </div>

          <div className="shrink-0">
            {outOfStock ? (
              <button
                disabled
                className="h-8 w-[86px] cursor-not-allowed rounded-lg border border-surface-border bg-surface-hover text-2xs font-semibold text-ink-faint lg:h-9 lg:w-24 lg:text-xs"
              >
                Sold out
              </button>
            ) : (
              <AddToCartButton product={product} cartItem={cartItem} />
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

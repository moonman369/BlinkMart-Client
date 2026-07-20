import React from "react";
import { cn } from "../../util/cn";

/**
 * Shimmering placeholder. Prefer this over spinners for content that has a
 * known shape — it keeps layout stable and avoids a jarring pop-in.
 */
export const Skeleton = ({ className, rounded = "rounded-lg", ...props }) => (
  <div className={cn("skeleton", rounded, className)} {...props} />
);

/** Placeholder matching <ProductCard /> so grids don't reflow when data lands. */
export const ProductCardSkeleton = () => (
  <div className="flex w-full flex-col gap-3 rounded-card border border-surface-border bg-surface-raised p-3">
    <Skeleton className="aspect-square w-full" rounded="rounded-xl" />
    <Skeleton className="h-3.5 w-14" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="mt-1 flex items-center justify-between gap-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-8 w-20" rounded="rounded-lg" />
    </div>
  </div>
);

/** Row placeholder for list/table views. */
export const RowSkeleton = () => (
  <div className="flex items-center gap-4 rounded-card border border-surface-border bg-surface-raised p-4">
    <Skeleton className="h-14 w-14 shrink-0" rounded="rounded-xl" />
    <div className="flex flex-1 flex-col gap-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-8 w-20" rounded="rounded-lg" />
  </div>
);

export default Skeleton;

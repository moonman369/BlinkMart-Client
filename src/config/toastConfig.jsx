import React from "react";
import { Toaster, toast } from "sonner";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoInformationCircle,
  IoWarning,
} from "react-icons/io5";
import { FiShoppingBag } from "react-icons/fi";

/**
 * Notification layer.
 *
 * Call sites use the `showToast` facade rather than the toast library directly,
 * so the engine stays swappable. Durations are deliberately longer than the
 * previous 1.5s — that was too short to finish reading a message.
 */

const DURATION = {
  short: 2600,
  base: 3600,
  long: 5000,
};

export const CustomToaster = () => (
  <Toaster
    theme="dark"
    position="top-center"
    expand={false}
    visibleToasts={3}
    closeButton
    gap={10}
    offset={16}
    toastOptions={{
      duration: DURATION.base,
      classNames: {
        toast:
          "!bg-surface-overlay !border !border-surface-border !shadow-e3 !rounded-card !text-ink-primary !font-medium backdrop-blur-xl",
        title: "!text-ink-primary !text-sm !font-semibold",
        description: "!text-ink-muted !text-xs",
        actionButton:
          "!bg-mint-600 !text-white !rounded-lg !text-xs !font-semibold !px-3 !h-8",
        cancelButton:
          "!bg-surface-hover !text-ink-secondary !rounded-lg !text-xs !font-semibold !px-3 !h-8",
        closeButton:
          "!bg-surface-hover !border-surface-border !text-ink-muted hover:!text-ink-primary",
      },
    }}
  />
);

const icons = {
  success: <IoCheckmarkCircle className="text-mint-400" size={20} />,
  error: <IoCloseCircle className="text-red-400" size={20} />,
  info: <IoInformationCircle className="text-blue-400" size={20} />,
  warning: <IoWarning className="text-brand-400" size={20} />,
};

export const showToast = {
  success: (message, options = {}) =>
    toast.success(message, {
      icon: icons.success,
      duration: DURATION.short,
      ...options,
    }),

  error: (message, options = {}) =>
    toast.error(message, {
      icon: icons.error,
      // Errors need longer — the user may need to act on them
      duration: DURATION.long,
      ...options,
    }),

  info: (message, options = {}) =>
    toast(message, { icon: icons.info, duration: DURATION.base, ...options }),

  warning: (message, options = {}) =>
    toast(message, { icon: icons.warning, duration: DURATION.base, ...options }),

  loading: (message, options = {}) =>
    toast.loading(message, { duration: Infinity, ...options }),

  custom: (message, options = {}) =>
    toast(message, { duration: DURATION.base, ...options }),

  dismiss: (id) => toast.dismiss(id),

  /**
   * Ties a toast to an async action so the user sees pending -> resolved
   * without the caller juggling loading ids manually.
   */
  promise: (promise, { loading, success, error } = {}) =>
    toast.promise(promise, {
      loading: loading || "Working on it...",
      success: success || "Done!",
      error: error || "Something went wrong",
    }),

  /**
   * Rich cart confirmation with product thumbnail and an undo affordance.
   * Quick-commerce apps confirm cart changes visually rather than with a
   * generic string, which is what makes the action feel reversible.
   */
  cart: (product, { quantity = 1, onUndo } = {}) =>
    toast.custom(
      (id) => (
        <div className="flex w-full items-center gap-3 rounded-card border border-surface-border bg-surface-overlay/95 p-3 shadow-e3 backdrop-blur-xl">
          {product?.image?.[0] ? (
            <img
              src={product.image[0]}
              alt=""
              className="h-11 w-11 shrink-0 rounded-lg bg-surface-hover object-contain p-1"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-mint-600/15 text-mint-400">
              <FiShoppingBag size={18} />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink-primary">
              {product?.name || "Item"}
            </p>
            <p className="text-xs text-ink-muted">
              {quantity > 0
                ? `Added to cart · Qty ${quantity}`
                : "Removed from cart"}
            </p>
          </div>

          {onUndo && (
            <button
              onClick={() => {
                onUndo();
                toast.dismiss(id);
              }}
              className="pressable shrink-0 rounded-lg bg-surface-hover px-3 py-1.5 text-xs font-semibold text-mint-400 transition-colors hover:bg-mint-600/15"
            >
              Undo
            </button>
          )}
        </div>
      ),
      { duration: DURATION.base }
    ),
};

export default showToast;

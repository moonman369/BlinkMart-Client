import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { cn } from "../../util/cn";

/**
 * Overlay container that renders as a bottom sheet on mobile and a centred
 * dialog on desktop — the pattern quick-commerce apps use for cart, filters
 * and confirmations.
 *
 * Handles: body scroll lock, Escape to close, backdrop click, focus ring.
 */
const Sheet = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
}) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKeyDown);

    // Lock background scroll while the sheet is open
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const widths = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl",
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: "100%", opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className={cn(
              "relative flex max-h-[92vh] w-full flex-col",
              "rounded-t-sheet border border-surface-border bg-surface-overlay shadow-e4",
              "sm:rounded-sheet",
              widths[size]
            )}
          >
            {/* Drag affordance — mobile only */}
            <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-surface-border sm:hidden" />

            {(title || onClose) && (
              <header className="flex shrink-0 items-start justify-between gap-4 px-5 pb-4 pt-4">
                <div className="min-w-0">
                  {title && (
                    <h2 className="truncate text-lg font-bold text-ink-primary">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-0.5 text-sm text-ink-muted">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="pressable -mr-1 shrink-0 rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink-primary"
                >
                  <IoClose size={20} />
                </button>
              </header>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">{children}</div>

            {footer && (
              <footer className="shrink-0 border-t border-surface-border bg-surface-overlay px-5 py-4">
                {footer}
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Sheet;

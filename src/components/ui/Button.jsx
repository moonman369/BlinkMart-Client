import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../util/cn";

const VARIANTS = {
  primary:
    "bg-mint-600 text-white hover:bg-mint-500 shadow-e1 hover:shadow-glow-mint disabled:hover:bg-mint-600",
  brand:
    "bg-brand-500 text-surface-base font-bold hover:bg-brand-400 shadow-e1 hover:shadow-glow-brand disabled:hover:bg-brand-500",
  secondary:
    "bg-surface-hover text-ink-primary border border-surface-border hover:bg-surface-overlay hover:border-ink-faint",
  ghost: "bg-transparent text-ink-secondary hover:bg-surface-hover hover:text-ink-primary",
  danger: "bg-red-600 text-white hover:bg-red-500 shadow-e1",
  outline:
    "bg-transparent text-mint-400 border border-mint-600/60 hover:bg-mint-600/10 hover:border-mint-500",
};

const SIZES = {
  xs: "h-7 px-2.5 text-2xs gap-1 rounded-lg",
  sm: "h-9 px-3.5 text-xs gap-1.5 rounded-lg",
  md: "h-11 px-5 text-sm gap-2 rounded-xl",
  lg: "h-12 px-7 text-base gap-2.5 rounded-xl",
};

const Spinner = () => (
  <span
    aria-hidden="true"
    className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
  />
);

/**
 * Primary interactive control.
 * Handles press feedback, loading state, and icon slots so callers stop
 * re-declaring button styling ad hoc.
 */
const Button = React.forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        whileTap={isDisabled ? undefined : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(
          "inline-flex select-none items-center justify-center font-semibold",
          "transition-colors duration-base ease-out",
          "disabled:cursor-not-allowed disabled:opacity-50",
          VARIANTS[variant],
          SIZES[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? <Spinner /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;

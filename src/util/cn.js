/**
 * Joins class names, dropping falsy values.
 * Keeps conditional class logic readable without pulling in clsx.
 */
export const cn = (...classes) => classes.filter(Boolean).join(" ");

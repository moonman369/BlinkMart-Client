export const IMAGE_MIMETYPE_LIST = [
  "image/jpeg", // JPEG/JPG
  "image/png", // PNG
  "image/gif", // GIF
  "image/bmp", // BMP
  "image/webp", // WebP
  "image/tiff", // TIFF
  "image/svg+xml", // SVG
  "image/x-icon", // ICO
  "image/heif", // HEIF
  "image/heic", // HEIC
];

export const USER_ROLE_ADMIN = "ADMIN";
export const ENV_DEV = "dev";
export const ENV_PROD = "prod";
export const COOKIE_CLEAR_SETTINGS = {
  path: "/",
  domain: import.meta.env.COOKIE_DOMAIN ?? ".*",
};

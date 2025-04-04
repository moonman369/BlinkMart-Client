export const convertToUrlString = (text) => {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(new RegExp("-+", "g"), "-")
    .replace(/^-+|-+$/g, "");
};

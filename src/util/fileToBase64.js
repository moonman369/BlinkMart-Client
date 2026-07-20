import logger from "./logger";

export const getFileAsBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      logger.log("File as base64", reader.result);
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      logger.error("Error: ", error);
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

export const getFileAsBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      console.log("File as base64", reader.result);
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      console.error("Error: ", error);
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

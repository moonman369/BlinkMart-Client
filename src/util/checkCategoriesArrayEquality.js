import hash from "object-hash";

export const checkCategoriesArrayEquality = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every(
    (category, index) => hashObject(category) === hashObject(arr2[index])
  );
  ex;
};

export const hashObject = (obj) => {
  return hash(JSON.stringify(obj));
};

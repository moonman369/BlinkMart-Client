import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

const SelectionDropDown = ({
  collection,
  handleAddOrRemove,
  newCollection,
}) => {
  const [collectionBucket, setCollectionBucket] = useState(collection);

  // console.log("collection", collection);

  useEffect(() => {
    setCollectionBucket(collection);
  }, [collection]);

  // console.log("collectionBucket", collectionBucket);

  const handleOnItemSelect = (e) => {
    e.preventDefault();
    const newId = e.target.value;
    const newItem = collectionBucket.find((item) => item?._id === newId);
    handleAddOrRemove([...newCollection, newItem]);

    const newBucket = collectionBucket.filter(
      (bucketItem) => bucketItem?._id !== newId
    );
    setCollectionBucket(newBucket);
    e.target.value = "";
  };

  const removeItem = (itemId) => {
    const updatedCollection = newCollection.filter(
      (item) => item?._id !== itemId
    );
    handleAddOrRemove(updatedCollection);

    setCollectionBucket((prevBucket) => [
      ...prevBucket,
      newCollection.find((item) => item?._id === itemId),
    ]);
  };

  return (
    <div className="grid gap-2 mt-4">
      <label>Select Category*</label>
      <div className="bg-gray-800 border p-3 focus-within:border-primary-200 outline-none rounded w-full gap-2">
        <div
          className={`flex gap-2 flex-wrap ${
            newCollection?.length > 0 ? "border-b border-gray-500 pb-2" : ""
          }`}
        >
          {newCollection?.map((item, index) => (
            <span
              key={index}
              className="bg-gray-700 text-[14px] text-secondary-200 font-semibold p-1 rounded flex items-center justify-center gap-1"
            >
              <p>{item?.name}</p>
              <IoClose
                size={15}
                className="cursor-pointer flex items-center justify-center text-primary-200 font-extrabold rounded-full"
                onClick={() => {
                  removeItem(item?._id);
                }}
              />
            </span>
          ))}
        </div>
        <select
          className="w-full outline-none bg-gray-800"
          onChange={handleOnItemSelect}
          name="category"
        >
          <option className="text-[14px]" value={""} disabled selected>
            Select atleast one or more options
          </option>
          {collectionBucket?.map((bucketItem, index) => (
            <option className="text-[14px]" key={index} value={bucketItem?._id}>
              {bucketItem?.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectionDropDown;

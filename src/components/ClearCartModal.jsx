import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import useScrollLock from "../hooks/useScrollLock";

const ClearCartModal = ({ isOpen, onClose, onConfirm }) => {
  const [processing, setProcessing] = useState(false);

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  const handleClearCart = async () => {
    try {
      setProcessing(true);
      await onConfirm();
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-700 max-w-sm lg:max-w-[40%] w-full p-4 rounded-md">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-[22px]">Clear Cart</h1>
          <button
            className="w-fit block ml-auto text-red-600"
            onClick={onClose}
          >
            <IoClose size={25} />
          </button>
        </div>
        <div className="flex-col items-center justify-center pt-4">
          <p className="my-4 flex items-center justify-center text-[16px] ml-3">
            Are you sure you want to{" "}
            <b className="text-red-400">&nbsp;clear all items&nbsp;</b> from
            your cart?
          </p>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={handleClearCart}
              className="px-4 py-1 rounded bg-red-400 hover:bg-red-500 text-bg-primary-100 font-semibold"
              disabled={processing}
            >
              {processing ? "Clearing..." : "Clear Cart"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-bg-primary-100 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClearCartModal;

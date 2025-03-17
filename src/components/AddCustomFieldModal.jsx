import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

const AddCustomFieldModal = ({ closeModal, setCustomFields }) => {
  const [newField, setNewField] = useState({
    name: "",
    value: "",
  });
  const [processing, setProcessing] = useState(false);

  const handleOnChange = (e) => {
    setNewField({ ...newField, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("hello");
    try {
      setProcessing(true);
      if (!newField.name || !newField.value) {
        toast.error("Field Name and Field Value are required!");
        return;
      }
      console.log("newField", newField);
      setCustomFields((prevFields) => [...prevFields, newField]);
      toast.success("Custom Field added successfully!");
      //   closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add custom field!");
    } finally {
      setProcessing(false);
    }
  };

  const handleKeyPress = (e) => {
    if(e.key === "Escape") {
        closeModal()
    }
    else if(e.key === "Enter") {
        handleSubmit()
    }
  }

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onKeyDown={handleKeyPress}>
      <div className="bg-gray-700 max-w-4xl lg:max-w-[40%] w-full p-4 rounded-md">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-[18px]">Add Custom Field</h1>
          <button
            className="w-fit block ml-auto text-red-600"
            onClick={closeModal}
          >
            <IoClose size={25} />
          </button>
        </div>

        <div className="my-6 grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="name">New Field Name*</label>
            <input
              type="text"
              name="name"
              value={newField?.name}
              className="w-full p-2 border rounded bg-gray-800 mt- focus-within:border-primary-200 outline-none"
              onChange={handleOnChange}
              placeholder="Enter New Field Name"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="value">New Field Value*</label>
            <input
              type="text"
              name="value"
              value={newField?.value}
              className="w-full p-2 border rounded bg-gray-800 mt- focus-within:border-primary-200 outline-none"
              onChange={handleOnChange}
              placeholder="Enter New Field Value"
            />
          </div>

          <button
            className={`text-white p-3 rounded font-semibold mt-8 tracking-wider text-[17px] ${
              newField?.name ? "bg-green-700 hover:bg-green-800" : "bg-gray-900"
            }`}
            disabled={!newField?.name || processing}
            onClick={handleSubmit}
          >
            {processing ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AddCustomFieldModal;

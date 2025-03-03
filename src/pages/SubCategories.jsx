import React, { useEffect, useState } from "react";
import AddSubcategoryModal from "../components/AddSubcategoryModal";
import axios from "axios";
import { axiosToastError } from "../util/axiosToastError";
import customAxios from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";
import DisplayTable from "../components/DisplayTable";
import { createColumnHelper } from "@tanstack/react-table";
import ViewImage from "../components/ViewImage";
import { LuPencil } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import EditSubcategoryModal from "../components/EditSubcategoryModal";

const SubCategories = () => {
  const [openAddSubcategoryModal, setOpenAddSubcategoryModal] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [openEditSubcategoryModal, setOpenEditSubcategoryModal] =
    useState(false);
  const [openViewImageModal, setOpenViewImageModal] = useState(false);

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("image", {
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <img
              src={row?.original?.image}
              alt={row?.original?.name}
              className="w-8 cursor-pointer"
              onClick={() => {
                handleImageClick(row?.original);
              }}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => {
        console.log("row", row?.original?.category);
        const categoriesArray = row?.original?.category;
        if (categoriesArray && categoriesArray.length > 0) {
          return categoriesArray.map((category) => (
            <div
              key={category._id}
              className="text-center px-1 inline-block shadow-secondary-200 shadow-sm"
            >
              {category.name}
            </div>
          ));
        }
        // return row?.original?.category?.name;
      },
    }),
    columnHelper.accessor("_id", {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <button
              className="text-gray-800 p-1 bg-primary-200 rounded-md hover:bg-yellow-600"
              onClick={() => handleEditClick(row?.original)}
            >
              <LuPencil size={16} />
            </button>
            <button className="text-gray-800 p-1 bg-red-500 rounded-md hover:bg-red-700 ml-2">
              <MdOutlineDelete size={16} />
            </button>
          </div>
        );
      },
    }),
  ];

  const fetchSubcategories = async () => {
    try {
      const subcategoryResponse = await customAxios({
        url: apiSummary.endpoints.subcategory.getAllSubcategories.path,
        method: apiSummary.endpoints.subcategory.getAllSubcategories.method,
      });
      if (
        subcategoryResponse.status ===
        apiSummary.endpoints.subcategory.getAllSubcategories.successStatus
      ) {
        setSubcategories(subcategoryResponse?.data?.data);
      }
    } catch (error) {
      axiosToastError(error);
    }
  };
  useEffect(() => {
    fetchSubcategories();
  }, []);

  const handleEditClick = (subcategory) => {
    setOpenEditSubcategoryModal(true);
    setSelectedSubcategory(subcategory);
    console.log("subcategory", subcategory);
  };
  const closeEditSubcategoryModal = () => {
    setOpenEditSubcategoryModal(false);
    setSelectedSubcategory(null);
  };

  const handleImageClick = (subcategory) => {
    setOpenViewImageModal(true);
    setSelectedSubcategory(subcategory);
  };
  const closeViewImageModal = () => {
    setOpenViewImageModal(false);
    setSelectedSubcategory(null);
  };

  console.log("subcategories", subcategories);

  return (
    <section>
      <div className="p-3 font-semibold bg-gray-900 shadow-secondary-200 shadow-md rounded-md flex items-center justify-between">
        <h2 className="text-[20px]">Subcategories</h2>
        <button
          className={`text-white p-3 rounded font-semibold tracking-wider bg-green-700 hover:bg-green-800`}
          onClick={() => setOpenAddSubcategoryModal(true)}
        >
          Add Subcategory
        </button>
      </div>

      <div>
        <DisplayTable data={subcategories} columns={columns} />
      </div>

      {openAddSubcategoryModal && (
        <AddSubcategoryModal
          closeModal={() => setOpenAddSubcategoryModal(false)}
          fetchSubcategories={fetchSubcategories}
        />
      )}

      {openViewImageModal && selectedSubcategory && (
        <ViewImage
          url={selectedSubcategory?.image}
          alt={selectedSubcategory?.name}
          close={closeViewImageModal}
        />
      )}

      {openEditSubcategoryModal && selectedSubcategory && (
        <EditSubcategoryModal
          closeModal={closeEditSubcategoryModal}
          subcategory={selectedSubcategory}
          fetchSubcategories={fetchSubcategories}
        />
      )}
    </section>
  );
};

export default SubCategories;

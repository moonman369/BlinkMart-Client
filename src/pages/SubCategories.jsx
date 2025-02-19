import React, { useEffect, useState } from "react";
import AddSubcategoryModal from "../components/AddSubcategoryModal";
import axios from "axios";
import { axiosToastError } from "../util/axiosToastError";
import customAxios from "../util/customAxios";
import { apiSummary } from "../config/api/apiSummary";
import DisplayTable from "../components/DisplayTable";
import { createColumnHelper } from "@tanstack/react-table";
import ViewImage from "../components/ViewImage";

const SubCategories = () => {
  const [openAddSubcategoryModal, setOpenAddSubcategoryModal] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

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
                setSelectedSubcategory(row?.original);
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
          fetchSubcategories={() => {}}
        />
      )}

      {selectedSubcategory && (
        <ViewImage
          url={selectedSubcategory?.image}
          alt={selectedSubcategory?.name}
          close={() => setSelectedSubcategory(null)}
        />
      )}
    </section>
  );
};

export default SubCategories;

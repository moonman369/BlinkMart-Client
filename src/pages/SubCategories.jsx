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
import DeleteCategoryModal from "../components/DeleteCategoryModal";
import DeleteSubcategoryModal from "../components/DeleteSubcategoryModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSubcategories } from "../util/fetchAllSubcategories";
import {
  setAllSubcategories,
  setSubcategoryPageDetails,
  setPaginatedSubcategories,
} from "../store/productSlice";
import PaginationBar from "../components/PaginationBar";

const SubCategories = () => {
  const dispatch = useDispatch();
  const [openAddSubcategoryModal, setOpenAddSubcategoryModal] = useState(false);
  const subcategories = useSelector(
    (state) => state.product.paginatedSubcategories
  );
  const subcategoryPageDetails = useSelector(
    (state) => state.product.pageDetails.subcategories
  );
  const [loading, setLoading] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [openEditSubcategoryModal, setOpenEditSubcategoryModal] =
    useState(false);
  const [openViewImageModal, setOpenViewImageModal] = useState(false);
  const [openDeleteSubcategoryModal, setOpenDeleteSubcategoryModal] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
              className="text-center px-1 inline-block rounded m-2 p-[2px] shadow-secondary-200 shadow-md"
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
            <button
              className="text-gray-800 p-1 bg-red-500 rounded-md hover:bg-red-700 ml-2"
              onClick={() => handleDeleteClick(row?.original)}
            >
              <MdOutlineDelete size={16} />
            </button>
          </div>
        );
      },
    }),
  ];

  const refreshSubcategories = async (currentPage, pageSize) => {
    try {
      setLoading(true);
      const fetchSubcategoriesResponse = await fetchAllSubcategories({
        all: false,
        currentPage,
        pageSize,
      });
      console.log(fetchSubcategoriesResponse);
      if (
        fetchSubcategoriesResponse.status ===
        apiSummary.endpoints.subcategory.getAllSubcategories.successStatus
      ) {
        console.log("Refresh Subcategories", fetchSubcategoriesResponse);
        dispatch(
          setPaginatedSubcategories(fetchSubcategoriesResponse.data.data)
        );
        dispatch(
          setSubcategoryPageDetails({
            pageSize: fetchSubcategoriesResponse?.data?.pageSize,
            currentPage: fetchSubcategoriesResponse?.data?.currentPage,
            count: fetchSubcategoriesResponse?.data?.count,
            totalCount: fetchSubcategoriesResponse?.data?.totalCount,
          })
        );
      }
    } catch (error) {
      console.error("Fetch Subcategories Error: ", error);
      axiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   fetchSubcategories();
  // }, []);

  const handleEditClick = (subcategory) => {
    setOpenEditSubcategoryModal(true);
    setSelectedSubcategory(subcategory);
    console.log("subcategory", subcategory);
  };
  const closeEditSubcategoryModal = () => {
    setOpenEditSubcategoryModal(false);
    setSelectedSubcategory(null);
  };

  const handleDeleteClick = (subcategory) => {
    setOpenDeleteSubcategoryModal(true);
    setSelectedSubcategory(subcategory);
    console.log("subcategory", subcategory);
  };
  const closeDeleteSubcategoryModal = () => {
    setOpenDeleteSubcategoryModal(false);
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
  console.log(
    `subcategoryPageDetails ${subcategoryPageDetails?.totalCount} ${Math.floor(
      subcategoryPageDetails?.totalCount / 10
    )} ${subcategoryPageDetails?.totalCount % 10 > 0 ? 1 : 0}`
  );

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

      <div className="overflow-auto w-full max-w-[90vw]">
        <DisplayTable data={subcategories} columns={columns} />
      </div>

      {openAddSubcategoryModal && (
        <AddSubcategoryModal
          closeModal={() => setOpenAddSubcategoryModal(false)}
          fetchSubcategories={() => {
            refreshSubcategories(1, 10);
          }}
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
          fetchSubcategories={() => {
            refreshSubcategories(1, 10);
          }}
        />
      )}

      {openDeleteSubcategoryModal && selectedSubcategory && (
        <DeleteSubcategoryModal
          closeModal={closeDeleteSubcategoryModal}
          subcategory={selectedSubcategory}
          fetchSubcategories={refreshSubcategories}
        />
      )}

      <PaginationBar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        styles={"mt-10"}
        pageSize={10}
        totalPages={Math.ceil(subcategoryPageDetails?.totalCount / 10)}
        reloadPage={refreshSubcategories}
      />
    </section>
  );
};

export default SubCategories;

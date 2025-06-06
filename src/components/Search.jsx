import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useMobile } from "../hooks/useMobile";
import { FaArrowLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery, addRecentSearch } from "../store/searchSlice";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMobile] = useMobile();
  const [isSearchPage, setIsSearchPage] = useState(
    location.pathname === "/search"
  );
  const searchQuery = useSelector((state) => state.search.searchQuery);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const searchInputRef = React.useRef(null);

  useEffect(() => {
    setIsSearchPage(location.pathname === "/search");
  }, [location]);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const redirectToSearchPage = () => {
    navigate("/search");
  };

  const redirectToHomePage = () => {
    navigate("/");
  };

  const handleSearchChange = (e) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (localSearchQuery.trim()) {
      dispatch(setSearchQuery(localSearchQuery));
      dispatch(addRecentSearch(localSearchQuery));
    }
    // Blur the input to close mobile keyboard
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (localSearchQuery.trim() === "") {
      dispatch(setSearchQuery(""));
    }
  }, [localSearchQuery]);

  return (
    <div className="w-full min-w-[300px] lg:min-w-[420px] lg:h-12 h-11 rounded-lg border overflow-hidden flex items-center text-neutral-400 bg-gray-700 group focus-within:border-primary-200">
      <div>
        {isMobile && isSearchPage ? (
          <button
            className="flex justify-center items-center h-full p-3 text-neutral-400 group-focus-within:text-primary-200"
            onClick={redirectToHomePage}
          >
            <FaArrowLeft size={20} />
          </button>
        ) : (
          <button
            className="flex justify-center items-center h-full p-3 text-neutral-400 group-focus-within:text-primary-200"
            onClick={handleSearch}
          >
            <IoSearch size={20} />
          </button>
        )}
      </div>
      <div className="w-full h-full flex items-center">
        {!isSearchPage ? (
          <div onClick={redirectToSearchPage} className="w-full">
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed once, initially
                `Search "Milk"`,
                1000,
                `Search "Sugar"`,
                1000,
                `Search "Bread"`,
                1000,
                `Search "Butter"`,
                1000,
                `Search "Chips"`,
                1000,
                `Search "Cold Drinks"`,
                1000,
                `Search "Chocolate"`,
                1000,
                `Search "Sanitizer"`,
                1000,
                `Search "Shampoo"`,
                1000,
                `Search "Soap"`,
                1000,
                `Search "Cheese"`,
                1000,
                `Search "Salt"`,
                1000,
                `Search "Deodorant"`,
                1000,
              ]}
              wrapper="span"
              speed={30}
              repeat={Infinity}
            />
          </div>
        ) : (
          <div className="w-full h-full">
            <input
              ref={searchInputRef}
              type="text"
              value={localSearchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
              placeholder="Search for groceries, snacks and more..."
              autoFocus
              className="bg-transparent w-full h-full outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

import React, { useEffect, useState } from "react";
import { IoSearch, IoClose } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useDispatch, useSelector } from "react-redux";
import { useMobile } from "../hooks/useMobile";
import { setSearchQuery, addRecentSearch } from "../store/searchSlice";
import { cn } from "../util/cn";

const SUGGESTIONS = [
  "Milk",
  "Sugar",
  "Bread",
  "Butter",
  "Chips",
  "Cold Drinks",
  "Chocolate",
  "Sanitizer",
  "Shampoo",
  "Soap",
  "Cheese",
  "Salt",
  "Deodorant",
];

// TypeAnimation expects a flat [text, pauseMs, text, pauseMs, ...] sequence
const TYPE_SEQUENCE = SUGGESTIONS.flatMap((item) => [`Search "${item}"`, 1200]);

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMobile] = useMobile();
  const searchQuery = useSelector((state) => state.search.searchQuery);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const searchInputRef = React.useRef(null);

  const isSearchPage = location.pathname === "/search";

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (localSearchQuery.trim() === "") dispatch(setSearchQuery(""));
  }, [localSearchQuery, dispatch]);

  const handleSearch = () => {
    if (localSearchQuery.trim()) {
      dispatch(setSearchQuery(localSearchQuery));
      dispatch(addRecentSearch(localSearchQuery));
    }
    searchInputRef.current?.blur();
  };

  const clearSearch = () => {
    setLocalSearchQuery("");
    dispatch(setSearchQuery(""));
    searchInputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "group flex h-11 w-full items-center overflow-hidden rounded-xl lg:h-12 lg:min-w-[420px]",
        "border border-surface-border bg-surface-raised text-ink-muted",
        "transition-all duration-base ease-out",
        "focus-within:border-mint-500/70 focus-within:bg-surface-overlay focus-within:shadow-glow-mint"
      )}
    >
      {isMobile && isSearchPage ? (
        <button
          onClick={() => navigate("/")}
          aria-label="Back to home"
          className="flex h-full items-center justify-center px-3 text-ink-muted transition-colors hover:text-ink-primary"
        >
          <FaArrowLeft size={18} />
        </button>
      ) : (
        <button
          onClick={handleSearch}
          aria-label="Search"
          className="flex h-full items-center justify-center px-3 text-ink-muted transition-colors group-focus-within:text-mint-400"
        >
          <IoSearch size={20} />
        </button>
      )}

      <div className="flex h-full min-w-0 flex-1 items-center">
        {!isSearchPage ? (
          <button
            onClick={() => navigate("/search")}
            className="h-full w-full truncate text-left text-sm text-ink-muted"
          >
            <TypeAnimation
              sequence={TYPE_SEQUENCE}
              wrapper="span"
              speed={40}
              repeat={Infinity}
              cursor
            />
          </button>
        ) : (
          <input
            ref={searchInputRef}
            type="text"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search for groceries, snacks and more..."
            autoFocus
            className="h-full w-full bg-transparent text-sm text-ink-primary outline-none placeholder:text-ink-faint"
          />
        )}
      </div>

      {isSearchPage && localSearchQuery && (
        <button
          onClick={clearSearch}
          aria-label="Clear search"
          className="flex h-full items-center justify-center px-3 text-ink-muted transition-colors hover:text-ink-primary"
        >
          <IoClose size={18} />
        </button>
      )}
    </div>
  );
};

export default Search;

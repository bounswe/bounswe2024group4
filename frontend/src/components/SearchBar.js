import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim().length > 2) {
      navigate("/search/" + searchTerm);
    } else {
      setErrorMessage("Search term must be at least 3 characters long.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const clearErrorMessage = () => {
    setErrorMessage("");
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search"
        className="border p-2 rounded-md mr-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>
        <FontAwesomeIcon icon={faSearch} />
      </button>
      {errorMessage && (
        <div className="text-red-500 text-sm mt-1">
          {errorMessage}
          <button onClick={clearErrorMessage} className="ml-2">
            X
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

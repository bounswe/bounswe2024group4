import React, { useContext, useState } from "react";
import { Context } from "../globalContext/globalContext.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const [searchTerm, setSearchTerm] = useState("");
  const search = async (searchTerm) => {
    try {
      const url = `${baseURL}/search/?query=${searchTerm}`;

      const response = await axios.get(url);

      return response.data;
    } catch (error) {
      console.error("Error searching:", error);
      return null;
    }
  };
  const handleSearch = async () => {
    try {
      const results = await search(searchTerm);
      if (searchTerm =='')
      if (results.team != null) {
        navigate("/team/" + results.team.id);
      }
      if (results.player != null) {
        navigate("/player/" + results.player.id);
      }
    } catch (error) {
      console.error("Error searching:", error);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
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
    </div>
  );
};

export default SearchBar;
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const search = async (searchTerm) => {
    try {
      const baseURL = "http://127.0.0.1:8000";
      // Creating URL
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
      // Sonuçları işleme veya gösterme işlemleri burada yapılabilir
      const team_data = results.team;
      const team_id = team_data.id;
      console.log("Search Results:", results);
      console.log("team id:", team_id);
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

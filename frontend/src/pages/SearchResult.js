import React, { useContext, useState, useEffect } from "react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import "../css/index.css";
import { Navbar } from "../components/Navbar";
import Post from "../components/Post.js";
import axios from "axios";
import { Context } from "../globalContext/globalContext.js";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SearchResult = () => {
  const navigate = useNavigate();
  const params = useParams();
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;

  const [players, setPlayers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamIds, setTeamIds] = useState([]);
  const [logos, setLogos] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [conferences, setConferences] = useState([]);
  const [mapArray, setMapArray] = useState([]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  const handleData = async () => {
    try {
      const response = await axios.get(baseURL + '/search/?query=' + params.query);
      setPlayers(response.data.players || []);
      setPosts(response.data.posts || []);

      if (response.data.team) {
        const teamData = response.data.team.map((team, index) => ({
          name: team[0],
          id: team[1],
          index
        }));
        setTeams(teamData.map(team => team.name));
        setTeamIds(teamData.map(team => team.id));
        setMapArray(teamData.map(team => team.index));
        teamData.forEach(team => handleTeamAttributes(team.id, team.index));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTeamAttributes = async (teamId, index) => {
    try {
      const response = await axios.get(baseURL + '/team/?id=' + teamId);
      setLogos(prev => {
        const newLogos = [...prev];
        newLogos[index] = response.data.image;
        return newLogos;
      });
      setCoaches(prev => {
        const newCoaches = [...prev];
        newCoaches[index] = response.data.coach;
        return newCoaches;
      });
      setConferences(prev => {
        const newConferences = [...prev];
        newConferences[index] = response.data.conference;
        return newConferences;
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    setPlayers([]);
    setPosts([]);
    setTeams([]);
    setTeamIds([]);
    setLogos([]);
    setCoaches([]);
    setConferences([]);
    setMapArray([]);
    handleData();
  }, [params.query]);

  const handleTeam = (id) => {
    navigate("/team/" + id);
  };

  const handlePlayer = (id) => {
    navigate("/player/" + id);
  };

  return (
    <div className="bg-sky-50 min-h-screen">
      <Navbar />
      <div className="relative bg-white p-8 mb-10 mt-20 rounded-3xl shadow-sm w-3/4 mx-auto max-h-screen">
        { /* <AdjustmentsHorizontalIcon className="w-8 h-8 border-2 rounded-full border-black absolute top-4 right-4" Filter />*/}
        <h2 className="text-2xl font-bold mb-10">Search Results for “{params.query}”:</h2>
        <div className="overflow-auto max-h-96 pr-2">
          <div className="border-b pb-4 mb-4">
            <h1 className="text-2xl font-bold mb-4">Related Teams</h1>
            {teams.length > 0
            ? mapArray.map((index) => (
              <div key={index} className="border-b pb-4 mb-4 flex items-center">
                <img 
                  src={logos[index]} 
                  alt={`${teams[index]} Image`} 
                  className="w-20 h-20 object-contain mr-4"
                />
                <h3 className="text-xl font-semibold mr-4">{teams[index]}</h3>
                <div className="flex flex-col mr-4">
                  <p> Conference:   {conferences[index]}</p>
                  <p> Coach:   {coaches[index]}</p>
                </div>
                <button 
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md ml-auto" 
                  onClick={() => handleTeam(teamIds[index])}
                >
                  Go to Team Page
                </button>
              </div>
            ))
          :
          <p className="text-center text-gray-500">Not found</p>}
        </div>
          <div className="border-b pb-4 mb-4">
            <h1 className="text-2xl font-bold mb-4">Related Players</h1>
            {players.length > 0
              ? players.map((player, index) => (
                <div key={index} className="border-b pb-4 mb-4 flex items-center">
                  <img 
                    src={player[2]} 
                    alt={`${player[0]} Image`} 
                    className="w-20 h-20 object-cover object-top rounded-full mr-4"
                  />
                  <h3 className="text-xl font-semibold mr-4">{player[0]}</h3>
                  <div className="flex flex-col mr-4">
                    <p> Date of birth:  { player[4] ? formatDate(player[4].replace("+", "").split("T")[0]) : "" }</p>
                    <p> Height:   {player[3].replace("+", "") } cm</p>
                  </div>
                  <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md ml-auto" 
                    onClick={() => handlePlayer(player[1])}
                  >
                    Go to Player Page
                  </button>
                </div>
              ))
            :
            <p className="text-center text-gray-500">Not found</p>}
          </div>
          <div className="border-b pb-4 mb-4">
            <h1 className="text-2xl font-bold mb-4">Related Posts</h1>
            {posts.length > 0 
              ? posts.map((post) => (
                  <Post key={post.id} postId={post.id} />
                ))
              : 
              <p className="text-center text-gray-500">Not found</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
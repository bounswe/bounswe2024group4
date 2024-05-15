import React, { useContext, useState, useEffect } from "react";
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
  const [team, setTeam] = useState('');
  const [teamID, setTeamID] = useState('');
  const [player, setPlayer] = useState('');
  const [playerID, setPlayerID] = useState('');
  const [posts, setPosts] = useState([]);
  
  const handleData = async () => {
    try {
      const response = await axios.get(baseURL + '/search/?query=' + params.query);
      setTeam(response.data.team ? response.data.team.team : '');
      setTeamID(response.data.team ? response.data.team.id : '');
      setPlayer(response.data.player ? response.data.player.player : '');
      setPlayerID(response.data.player ? response.data.player.id : '');
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  useEffect(() => {
    setTeam('');
    setTeamID('');
    setPlayer('');
    setPlayerID('');
    setPosts([]);
    handleData();
  }, [params.query]);

  const handleTeam = () => {
    navigate("/team/" + teamID);
  };

  const handlePlayer = () => {
    navigate("/player/" + playerID);
  };

  return (
    <div className="bg-sky-50 min-h-screen">
        <Navbar />
        <div className="bg-white p-8 mb-10 mt-20 rounded-3xl shadow-sm w-3/4 mx-auto max-h-screen">
            <h2 className="text-2xl font-bold mb-10">Search Results for “{params.query}”:</h2>
            <div className="overflow-auto max-h-96 pr-2">
              {team && (
                <div className="border-b pb-4 mb-4">
                  <div className="flex items-center mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{team}</h3>
                      <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md mt-2" onClick={handleTeam} >Go to Team Page</button>
                    </div>
                  </div>
                </div>
              )}
              {player && (
                <div className="border-b pb-4 mb-4">
                  <div className="flex items-center mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{player}</h3>
                      <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md mt-2" onClick={handlePlayer} >Go to Player Page</button>
                    </div>
                  </div>
                </div>
              )}
            <div className="border-b pb-4 mb-4 ">
                <h1 className="text-2xl font-bold mb-4"> Related Posts </h1>
                {posts.length > 0 
                ?
                posts.map((post) => (
                <Post key={post.id} postId={post.id} />
                ))
                :
                "Not found"}
            </div>
            </div>
        </div>
    </div>
  );
};

export default SearchResult;

import React, { useContext, useState, useEffect } from 'react';
import "../css/index.css";
import { Navbar } from '../components/Navbar';
import axios from 'axios';
import { Context } from "../globalContext/globalContext.js";
import { useParams } from 'react-router-dom';

const Player = () => {
  const id = useParams();
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const [playername, setPlayername] = useState('');
  const [height, setHeight] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [instagram, setInstagram] = useState('');
  const [teams, setTeams] = useState('');
  const [image, setImage] = useState('');
  const [positions, setPositions] = useState('');
  const [awards, setAwards] = useState('');

  const handleData = async () => {
    try {
      const response = await axios.get(baseURL + '/player/?id=' + id.id);
      setPlayername(response.data.name);
      setHeight(response.data.height);
      setBirthdate(response.data.date_of_birth);
      setInstagram(response.data.instagram);
      setTeams(response.data.teams);
      setPositions(response.data.positions);
      setAwards(response.data.awards);
      setImage(response.data.image);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    handleData();
  });

    return (
      <div className="bg-sky-50 min-h-screen bg-top-left">
        <Navbar />
        <main className="container mx-auto mt-10 flex justify-center">
          <div className="bg-white p-8 mb-10 rounded-3xl shadow-sm w-3/4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col items-center lg:items-start">
                <h1 className="text-3xl font-semibold text-center mb-2">{ playername }</h1>
                <img className="h-auto max-w-lg mb-4" src={ image } alt="Player"/>
                <div className="grid grid-cols-2 gap-2 mb-2 text-left">
                  <div className="flex items-center">
                      <p className="text-lg mb-1 my-4">Height:</p>
                    </div>
                    <div>
                      <p className="text-lg mb-1 my-4">{ height.replace("+", "")} cm</p>
                    </div>
                  <div className="flex items-center">
                    <p className="text-lg mb-1 my-4">Date of Birth (Y-M-D):</p>
                  </div>
                  <div>
                    <p className="text-lg mb-1 my-4">{ birthdate.replace("+", "").split("T")[0] }</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-lg mb-1 my-4">Position:</p>
                  </div>
                  <div>
                    <p className="text-lg mb-1 my-4">{ positions.length > 0 ? positions.join(", ") : positions[0] }</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-lg mb-1 my-4">Instagram:</p>
                  </div>
                  <div>
                    <p className="text-lg mb-1 my-4">{ instagram }</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Professional Career</h2>
                <ul className="list-none pl-10">
                  {Object.entries(teams).sort(([, a], [, b]) => {
                    if (a.start != null && b.start != null && a.end != null && b.end != null && a.start.localeCompare(b.start) == 0) {
                      return a.end.localeCompare(b.end);
                    } else if (a.start != null && b.start != null) {
                      return a.start.localeCompare(b.start);
                    } else {
                      return 0;
                    }
                  }).map(([team, dates]) => (
                    <li className="text-lg mb-2" key={ team }>
                      { team } ({dates.start ? dates.start.slice(1, 5) : ""} - {dates.end ? dates.end.slice(1, 5) : ""})
                    </li>
                  ))}
                </ul>
                <h2 className="text-2xl font-semibold mt-8 mb-4">Career Highlights and Awards</h2>
                <ul className="list-none pl-10">
                  {Object.entries(awards).sort(([ ,a], [ ,b]) => {
                    if (a != null && b != null) {
                      return a.localeCompare(b);
                    } else {
                      return 0;
                    }
                  }).map(([award, date]) => (
                    <li className="mb-1" key={ award }>
                      { award } ({date ? date.slice(1, 5) : "null"})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
}

export default Player;
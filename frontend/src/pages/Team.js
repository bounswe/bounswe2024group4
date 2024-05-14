import React, { useContext, useState, useEffect } from 'react';
import "../css/index.css";
import { Navbar } from '../components/Navbar';
import axios from 'axios';
import { Context } from "../globalContext/globalContext.js";
import { useParams } from 'react-router-dom';

const Team = () => {
  const id = useParams();
  console.log(id);
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const [teamname, setTeamname] = useState('');
  const [conference, setConference] = useState('');
  const [division, setDivision] = useState('');
  const [coach, setCoach] = useState('');
  const [stadium, setStadium] = useState('');
  const [image, setImage] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleData = async () => {
    try {
      console.log(id);
      const response = await axios.get(baseURL + '/team/?id=' + id.id);
      console.log(response);
      setTeamname(response.data.name);
      setConference(response.data.conference);
      setDivision(response.data.division);
      setCoach(response.data.coach);
      setStadium(response.data.venue);
      setLatitude(response.data.venue_latitude);
      setLongitude(response.data.venue_longitude);
      setImage(response.data.image);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  return (
    <div className= "bg-sky-50 min-h-screen bg-top-left">
      <Navbar />
      <main className="container mx-auto mt-10 flex justify-center">
        <div className="bg-white p-8 mb-10 rounded-3xl shadow-sm w-3/4">
          <div className="flex items-center justify-center mb-6">
            <img className="h-auto max-w-lg" src={image} alt="logo" />
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">{ teamname }</h1>
          <div className="grid grid-cols-2 gap-2 mb-2 text-left">
            <div className="flex items-center">
              <p className="font-semibold text-xl my-4">Conference:</p>
            </div>
            <div>
              <p className="text-xl my-4">{ conference }</p>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-xl my-4">Division:</p>
            </div>
            <div>
              <p className="text-xl my-4">{ division }</p>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-xl my-4">Coach:</p>
            </div>
            <div>
              <p className="text-xl my-4">{ coach }</p>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-xl my-4">Stadium:</p>
            </div>
            <div>
              <p className="text-xl my-4">{ stadium }</p>
            </div>
          </div>
          <div className="flex mx-auto justify-center mt-10 mb-6">
              <iframe
                className="rounded-2xl"
                title="Map"
                width="700"
                height="350"
                loading="lazy"
                allowFullScreen
                frameBorder="0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.1}%2C${latitude - 0.1}%2C${longitude + 0.1}%2C${latitude + 0.1}&amp;layer=mapnik`}
              ></iframe>
            </div>
        </div>
      </main>
    </div>
  )
}

export default Team;

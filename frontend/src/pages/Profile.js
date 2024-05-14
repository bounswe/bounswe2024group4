import React, { useContext, useState, useEffect } from 'react';
import "../css/index.css";
import { Navbar } from '../components/Navbar';
import Post from '../components/Post.js';
import axios from 'axios';
import { Context } from "../globalContext/globalContext.js";
import { useParams } from 'react-router-dom';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [isFollowing, setIsFollowing] = useState(true);
  const params = useParams();

  const handleData = async () => {
    try {
      setUsername(params.username);
      const response = await axios.get(baseURL + '/profile_view_edit/' + username);
      console.log(response.data.username);
      

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  }

  useEffect(() => {
    handleData();
  }, []);

  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  return (
    <div className="bg-sky-50 min-h-screen">
      <Navbar />
      <div class="flex container mx-auto ml-28 mt-[5vh] gap-8">
        <div class="w-1/4 p-4 h-min">
          <div class="bg-white p-6 rounded-2xl shadow h-full relative">
            <img class="w-36 h-36 rounded-full mx-auto mb-4" src="https://hips.hearstapps.com/hmg-prod/images/r1g0dr-1-1670869236.jpg?crop=1.00xw:0.667xh;0,0.0811xh&resize=1200:*" alt=""/>
                <p class="mx-auto font-extrabold text-center text-3xl mb-4"> {username} </p>
                <p class="mb-8"> VERY QUOTATIOUS, I PERFORM RANDOM ACTS OF SHAQNESS VERY QUOTATIOUS, I PERFORM RANDOM ACTS OF SHAQNESS VERY QUOTATIOUS, I PERFORM RANDOM ACTS OF SHAQNESS VERY QUOTATIOUS, I PERFORM RANDOM ACTS OF SHAQNESS </p>
                <div class="flex justify-center items-center gap-x-3 ml-4">
                  <div class="flex flex-col items-center">
                    <span class="font-bold">15.7M</span>
                    <span class="font-light">Followers</span>
                  </div>
                  <div class="flex flex-col items-center">
                    <span class="font-bold">50</span>
                    <span class="font-light">Following</span>
                  </div>
                  <button class={`${isFollowing ? 'bg-white border text-blue-500' : 'bg-blue-500 text-white'} ${isFollowing ? 'hover:bg-slate-50' : 'hover:bg-blue-700'} font-bold min-w-24 py-2 rounded-lg mr-2`} onClick={handleFollow}>{isFollowing ? 'Following' : 'Follow'}</button>
                </div>
          </div>                 
        </div>

        <div class="w-8/12 p-4 h-[80vh]">
          <div class="bg-white p-6 rounded-2xl overflow-auto shadow h-full">
            <h1 class="text-2xl font-bold mb-4"> Posts </h1>
            <Post author={{ name: "shaq", avatar: "https://hips.hearstapps.com/hmg-prod/images/r1g0dr-1-1670869236.jpg?crop=1.00xw:0.667xh;0,0.0811xh&resize=1200:*"}} createdAt="2024-05-11T04:43:24.342858" image="https://pbs.twimg.com/media/Eb8RHOhWkAE9hcR?format=jpg&name=large" postId="3" />
          </div>
        </div>
      </div>
    </div>
    )
}

export default Profile;
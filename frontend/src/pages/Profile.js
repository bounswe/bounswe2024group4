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
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const params = useParams();

  const handleData = async () => {
    try {
      setUsername(params.username);
      const response = await axios.get(baseURL + '/profile_view_edit_others/' + params.username);
      setBio(response.data.bio);
      setProfilePictureURL(baseURL + response.data.profile_picture);
      setFollowerCount(response.data.followers_count);
      setFollowingCount(response.data.following_count);
      setIsFollowing(response.data.isFollowing);
      setPosts(response.data.posts);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFollow = () => {

  }

  useEffect(() => {
    handleData();
  }, []);

  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  return (
    <div className="bg-sky-50 min-h-screen">
      <Navbar />
      <div className="flex container mx-auto ml-28 mt-[5vh] gap-8">
        <div className="w-1/4 p-4 h-min">
          <div className="bg-white p-6 rounded-2xl shadow h-full items-center">
            <img className="w-36 h-36 rounded-full mx-auto mb-4 border border-slate-150" src={profilePictureURL} alt=""/>
                <p className="mx-auto font-extrabold text-center text-3xl mb-4"> {username} </p>
                {bio && <p className="mb-8">{bio}</p>}
                <div className="flex justify-center items-center gap-x-3 mx-auto mb-3">
                  <div className="flex flex-col items-center">
                    <span className="font-bold">{followerCount}</span>
                    <span className="font-light">Followers</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold">{followingCount}</span>
                    <span className="font-light">Following</span>
                  </div>
                </div>
                <button className={`${isFollowing ? 'bg-white border text-blue-500' : 'bg-blue-500 text-white'} ${isFollowing ? 'hover:bg-slate-50' : 'hover:bg-blue-700'} font-bold py-2 w-full mx-auto rounded-lg`} onClick={handleFollow}>{isFollowing ? 'Following' : 'Follow'}</button>
          </div>                 
        </div>

        <div className="w-8/12 p-4 h-[80vh]">
          <div className="bg-white p-6 rounded-2xl overflow-auto shadow h-full">
            <h1 className="text-2xl font-bold mb-4"> Posts </h1>
            {posts.map((post) => (
              <Post
                key={post.post_id}
                postId={post.post_id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    )
}

export default Profile;
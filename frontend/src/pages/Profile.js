import React, { useContext, useState, useEffect } from "react";
import "../css/index.css";
import { Navbar } from "../components/Navbar";
import Post from "../components/Post.js";
import axios from "axios";
import { Context } from "../globalContext/globalContext.js";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import EditProfileModal  from "../components/EditProfileModal.js";
import UserListInfoModal from "../components/UserListInfoModal.js";

const Profile = () => {
  const [ownProfile, setOwnProfile] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [email, setEmail] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowerModalOpen, setIsFollowerModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const params = useParams();

  const handleData = async () => {
    try {
      let response;
      setUsername(params.username);
      if (localStorage.getItem("username") === params.username) {
        setOwnProfile(true);
        response = await axios.get(baseURL + "/profile_view_edit_auth");
        setEmail(response.data.email);
        let followersResponse = await axios.get(
          baseURL + "/user_followers/"
        );
        let followingsResponse = await axios.get(
          baseURL + "/user_followings/"
        );
        setFollowers(followersResponse.data.followers_info.map(info => info.username));
        setFollowings(followingsResponse.data.followings_info.map(info => info.username));
      } else {
        response = await axios.get(
          baseURL + "/profile_view_edit_others/" + params.username
        );
      }
      setBio(response.data.bio);
      setProfilePictureURL(baseURL + response.data.profile_picture);
      setFollowerCount(response.data.followers_count);
      setFollowingCount(response.data.following_count);
      setIsFollowing(response.data.is_following);
      setPosts(response.data.posts);

      
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFollow = async () => {
    if (ownProfile) {
      setIsModalOpen(true);
    } else if (isFollowing) {
      // Optimistically update the follow state so we don't wait for the server
      const prevFollowerCount = followerCount;
      setIsFollowing(false);
      setFollowerCount((prev) => prev - 1);
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      };

      try {
        const response = await axios.post(
          baseURL + "/unfollow_user/" + username,
          "",
          config
        );
        if (response.status !== 200) {
          // Unfollow is not accepted by the server, revert back
          setIsFollowing(true);
          setFollowerCount(prevFollowerCount);
        }
      } catch (error) {
        console.error("Error following the user:", error);
        setIsFollowing(true);
        setFollowerCount(prevFollowerCount);
      }
    } else {
      // Optimistically update the follow state so we don't wait for the server
      const prevFollowerCount = followerCount;
      setIsFollowing(true);
      setFollowerCount((prev) => prev + 1);
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      };

      try {
        const response = await axios.post(
          baseURL + "/follow_user/" + username,
          "",
          config
        );
        if (response.status !== 200) {
          // Follow is not accepted by the server, revert back
          setIsFollowing(false);
          setFollowerCount(prevFollowerCount);
        }
      } catch (error) {
        console.error("Error following the user:", error);
        setIsFollowing(false);
        setFollowerCount(prevFollowerCount);
      }
    }
  };

  const handleUpdateProfile = (newBio, newProfilePictureURL) => {
    setBio(newBio);
    setProfilePictureURL(baseURL + newProfilePictureURL);
  };

  const handleFollowingModal = () => {
    if (!ownProfile) return;
    setIsFollowingModalOpen(true);
  };

  const handleFollowerModal = () => {
    if (!ownProfile) return;
    setIsFollowerModalOpen(true);
  };

  useEffect(() => {
    handleData();
  }, [params.username, profilePictureURL]);

  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  return (
    <div className="bg-sky-50 min-h-screen">
      <Navbar />
      <div className="flex container mx-auto ml-28 mt-[5vh] gap-8">
        <div className="w-1/4 p-4 h-min">
          <div className="bg-white p-6 rounded-2xl shadow h-full items-center">
            <img
              className="w-36 h-36 rounded-full mx-auto mb-4 border border-slate-150"
              src={profilePictureURL}
              alt=""
            />
            <p className="mx-auto font-extrabold text-center text-3xl mb-2">
              {" "}
              {username}{" "}
            </p>
            {ownProfile && <p className="mx-auto font-light text-center text-sm mb-4">
              {" "}
              {email}{" "}
            </p>}
            {bio && <p className="mb-4">{bio}</p>}
            <div className="flex justify-center items-center gap-x-3 mx-auto mb-3">
              <div className="flex flex-col items-center" onClick={handleFollowerModal}>
                <span className="font-bold">{followerCount}</span>
                <span className="font-light">Followers</span>
              </div>
              <div className="flex flex-col items-center" onClick={handleFollowingModal}>
                <span className="font-bold">{followingCount}</span>
                <span className="font-light">Following</span>
              </div>
            </div>
            <button
              className={`${
                ownProfile
                  ? "bg-white border text-black"
                  : isFollowing
                  ? "bg-white border text-blue-500"
                  : "bg-blue-500 text-white"
              } ${
                ownProfile
                  ? "hover:bg-slate-50"
                  : isFollowing
                  ? "hover:bg-slate-50"
                  : "hover:bg-blue-700"
              } font-bold py-2 w-full mx-auto rounded-lg`}
              onClick={handleFollow}
            >
              {ownProfile && !isFollowing
                ? "Edit Profile"
                : isFollowing
                ? "Following"
                : "Follow"}
            </button>
          </div>
        </div>

        <div className="w-8/12 p-4 h-[80vh]">
          <div className="bg-white p-6 rounded-2xl overflow-auto shadow h-full">
            <h1 className="text-2xl font-bold mb-4"> Posts </h1>
            {posts.map((post) => (
              <Post key={post.post_id} postId={post.post_id} />
            ))}
          </div>
        </div>
      </div>
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentBio={bio}
        currentProfilePictureURL={profilePictureURL}
        currentEmail={email}
        onUpdate={handleUpdateProfile}
      />
      <UserListInfoModal
        isOpen={isFollowerModalOpen}
        onClose={() => setIsFollowerModalOpen(false)}
        usernames={followers}
        title="Followers"
      />
      <UserListInfoModal
        isOpen={isFollowingModalOpen}
        onClose={() => setIsFollowingModalOpen(false)}
        usernames={followings}
        title="Following"
      />
    </div>
  );
};

export default Profile;
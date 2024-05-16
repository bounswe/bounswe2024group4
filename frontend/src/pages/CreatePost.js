import React, { useState, useEffect, useContext } from "react";
import { Navbar } from "../components/Navbar";
import axios from "axios";
import Cookies from "js-cookie";
import { Context } from "../globalContext/globalContext.js";
import { useNavigate } from "react-router-dom";

function CreatePost({ onCreatePost }) {
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [hyperlinkWords, setHyperlinkWords] = useState([]);
  const [hyperlinkURLs, setHyperlinkURLs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await axios.get(baseURL + "/profile_view_edit_auth");
        setProfilePictureURL(baseURL + response.data.profile_picture);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePicture();
    // Retrieve author name from local storage
    const storedAuthorName = localStorage.getItem("username");
    if (storedAuthorName) {
      setAuthorName(storedAuthorName);
    }
  }, []);

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

  const handleHyperlinkWordsSearch = async () => {
    try {
      setLoading(true); // Set loading state to true when starting the search

      const urls = await Promise.all(
        hyperlinkWords.map(async (word) => {
          try {
            const results = await search(word);
            console.log(results);
            if (results && results.team && results.team.length > 0) {
              return `/team/${results.team[0][1]}`;
            }
            if (results && results.players && results.players.length > 0) {
              return `/player/${results.players[0][1]}`;
            }
            alert(
              "There is a error in hyperlinking.Check your input and try again"
            );
            return null;
          } catch (error) {
            console.error(`Error retrieving URL for ${word}:`, error);
            return null;
          }
        })
      );

      setHyperlinkURLs(urls); // Set the fetched URLs
    } catch (error) {
      console.error("Error searching hyperlinks:", error);
    } finally {
      setLoading(false); // Set loading state to false when search is complete
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate inputs
    if (!content) {
      alert("Please enter content");
      return;
    }
    // Create post object
    let newContent = content;
    if (hyperlinkWords.length > 0 && hyperlinkURLs.length > 0) {
      hyperlinkWords.forEach((word, index) => {
        if (hyperlinkURLs[index]) {
          newContent = newContent.replace(
            new RegExp(word, "g"),
            `<a href="${hyperlinkURLs[index]}">${word}</a>`
          );
        }
      });
    }

    const newPostData = new FormData();
    newPostData.append("content", newContent);
    newPostData.append("image", selectedImage);
    const config = {
      withCredentials: true,
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };
    try {
      // Send post request to backend
      const response = await axios.post(
        baseURL + "/post/",
        newPostData,
        config
      );
      // Handle success, maybe show a success message
      console.log("Post created:", response.data);

      // Call the onCreatePost function passed from parent component
      //onCreatePost(response.data);
      // Clear input fields after submission
      setContent("");
      setSelectedImage(null);
      setHyperlinkWords([]);
      setHyperlinkURLs([]);
      navigate("/");
    } catch (error) {
      // Handle errors, maybe show an error message
      console.error("Error:", error);
    }
  };

  const handleAddPhoto = (e) => {
    // Get the selected file from input
    const file = e.target.files[0];
    // Check if a file is selected
    if (file) {
      // Update the state with the selected image
      setSelectedImage(file);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-sky-50 min-h-screen flex justify-center items-center">
        <div className="bg-white p-20 rounded-md shadow-md max-w-xl w-full text-center">
          <h2 className="text-lg font-semibold mb-4">Create a Post</h2>
          <div className="flex justify-center items-center mb-4">
            <img
              src={profilePictureURL}
              alt="Profile Picture"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h2 className="text-lg font-semibold">{authorName}</h2>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mb-2 h-32"
            ></textarea>
            <div className="mb-2">
              <label htmlFor="hyperlinkWords" className="block mb-3">
                Hyperlink Words (comma-separated)
              </label>
              <input
                type="text"
                id="hyperlinkWords"
                value={hyperlinkWords.join(",")}
                onChange={(e) => setHyperlinkWords(e.target.value.split(","))}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            {loading ? (
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-3"
                onClick={handleHyperlinkWordsSearch}
              >
                Set Hyperlinks
              </button>
            )}
            <label
              htmlFor="photoInput"
              className="block mb-2"
              style={{ display: "inline-block" }}
            >
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-3 mr-3 mb-3 mt-10"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  document.getElementById("photoInput").click();
                }}
              >
                Add Photo
              </button>
              <input
                type="file"
                id="photoInput"
                accept="image/*"
                onChange={handleAddPhoto}
                className="hidden"
                style={{ display: "none" }}
              />
            </label>
            {/* Selected image preview */}
            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                className="max-w-xs mx-auto mb-2 rounded-md"
              />
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreatePost;

import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Context } from "../globalContext/globalContext.js";

const EditProfileModal = ({
  isOpen,
  onClose,
  currentBio,
  currentProfilePictureURL,
  onUpdate,
}) => {
  const [profilePicture, setProfilePicture] = useState(currentProfilePictureURL);
  const [bio, setBio] = useState(currentBio);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;

  const validateEmail = (emailAddress) => {
    console.log(emailAddress);
    let reg = /\w+@\w+\.\w+/;
    return reg.test(emailAddress)
  }

  const validatePassword = (password) => {
    if (password === '')
      return false;
    let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return reg.test(password)
  }

  const handleSave = async () => {
    setFormErrorMessage('');
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    if (email && !validateEmail(email)) {
      setFormErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password && !validatePassword(password)) {
      setFormErrorMessage('Please enter a valid password.');
      return;
    }

    const formData = new FormData();
    if (bio) formData.append("bio", bio);
    if (profilePicture) formData.append("profile_picture", profilePicture);
    if (password) formData.append("password", password);
    if (email) formData.append("email", email);
    
    try {
      const response = await axios.post(
        baseURL + "/profile_view_edit_auth",
        formData,
        config
      );
      if (response.status === 200) {
        onClose();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
          <div class="flex w-64 text-center">
            <div class="w-24 h-24 mb-4 rounded-full">
              <img
                class="w-24 h-24 absolute rounded-full border border-gray-150"
                src={currentProfilePictureURL}
                alt=""
              />
              <label
                for="fileUpload"
                class="w-24 h-24 hover:bg-gray-200 opacity-60 rounded-full flex absolute justify-center items-center cursor-pointer transition duration-500"
              >
                <img
                  class="group-hover:block  bg-gray-300 rounded-2xl px-2 py-2 w-5/12"
                  src="https://www.svgrepo.com/show/33565/upload.svg"
                  alt=""
                />
                <input
                  type="file"
                  id="fileUpload"
                  class="hidden"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                />
              </label>
              <input
                type="text"
                name="email"
                placeholder="New email"
                className="absolute border p-2 rounded-md ml-20 w-72"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                name="password"
                placeholder="New password"
                className="absolute border p-2 rounded-md ml-20 mt-12 w-72"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              className="w-full mt-1 p-2 border rounded-md"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end text-center">
            { formErrorMessage !== '' && <p className="text-red-500 mr-4">{formErrorMessage}</p>}
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 font-bold text-white py-2 px-4 rounded-lg"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditProfileModal;

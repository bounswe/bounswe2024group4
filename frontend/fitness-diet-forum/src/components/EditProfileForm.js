import React, { useState, useContext } from "react";
import axios from "axios";
import { Context } from "../globalContext/globalContext.js";

const EditProfileForm = ({ userData, onClose, onUpdate }) => {
    const globalContext = useContext(Context);
    const { baseURL } = globalContext;
    const [formData, setFormData] = useState({
        username: userData.username || "",
        email: userData.email || "",
        bio: userData.bio || "",
        weight: userData.weight || "",
        height: userData.height || "",
        password: "",
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [preview, setPreview] = useState(userData.profile_picture || ""); 
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        if (file) {
            setPreview(URL.createObjectURL(file)); // Generate a preview
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem("token");

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key]) formDataToSend.append(key, formData[key]);
        });
        if (profilePicture) formDataToSend.append("profile_picture", profilePicture);

        try {
            const response = await axios.post(
                `${baseURL}/edit_profile/`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                alert("Profile updated successfully!");
                onUpdate(formData); // Update the parent state
                onClose(); // Close the form
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md relative">
                <h2 className="text-white text-2xl mb-4 text-center">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 flex flex-col items-center">
                        <div className="w-24 h-24 mb-4 relative">
                            <img
                                className="w-24 h-24 rounded-full border border-gray-300 object-cover"
                                src={preview || "https://via.placeholder.com/150"}
                                alt="Profile Preview"
                            />
                            <label
                                htmlFor="fileUpload"
                                className="absolute inset-0 hover:bg-gray-200 opacity-60 rounded-full flex justify-center items-center cursor-pointer transition duration-500"
                            >
                                <img
                                    className="w-6 h-6"
                                    src="https://www.svgrepo.com/show/33565/upload.svg"
                                    alt="Upload Icon"
                                />
                                <input
                                    type="file"
                                    id="fileUpload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                        <p className="text-gray-300 text-sm">Change profile picture</p>
                    </div>
                    {Object.keys(formData).map((field) => (
                        <div key={field} className="mb-4">
                            <label className="block text-white capitalize mb-1">
                                {field.replace("_", " ")}
                            </label>
                            <input
                                type={field === "password" ? "password" : "text"}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-gray-700 text-white"
                                placeholder={`Enter your ${field}`}
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-blue-300"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        type="button"
                        className="w-full bg-gray-500 text-white py-2 rounded-lg mt-2 hover:bg-gray-600 transition"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileForm;

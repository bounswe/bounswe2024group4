import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); 

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/sign_up/", {
        username,
        email,
        password,
        user_type: "member",
      });

      console.log("Signup Successful", response.data);
      setSuccess("Signup successful! Redirecting to login...");
      setError("");

      
      setTimeout(() => {
        navigate("/login"); 
      }, 2000); 
    } catch (err) {
      console.error("Signup Failed", err.response?.data || err.message);
      setError(err.response?.data.message || "Signup failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-900">
      <div className="bg-blue-800 text-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-xl mb-4 font-bold text-center">Signup</h1>
        <form onSubmit={handleSignup}>
          <label className="block mb-2">Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 mb-4 border rounded text-black"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="block mb-2">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 mb-4 border rounded text-black"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="block mb-2">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 mb-4 border rounded text-black"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="block mb-2">Confirm Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 mb-4 border rounded text-black"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

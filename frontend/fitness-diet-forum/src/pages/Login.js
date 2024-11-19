import React, { useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../assets/Animation1.json"; 

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Username:", username, "Password:", password);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-900">
      
      <div className="bg-blue-800 text-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-2xl mb-6 font-bold text-center">Fitness & Diet Forum</h1>
        <form onSubmit={handleLogin}>
          <label className="block mb-2">Username</label>
          <input
            type="username"
            className="w-full px-3 py-2 mb-4 border rounded text-black"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="block mb-2">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 mb-4 border rounded text-black"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Sign In
          </button>
        </form>
        <a href="#" className="block mt-4 text-center underline">
          Forgot password?
        </a>
        <p className="mt-4 text-center">
  Don't have an account?{" "}
  <a href="/signup" className="text-blue-400 underline">
    Sign Up
  </a>
</p>
      </div>

      
      <div className="ml-8 max-w-lg">
        <Player
          autoplay
          loop
          src={animationData} 
          style={{ height: "300px", width: "300px" }}
        />
      </div>
    </div>
  );
};

export default Login;




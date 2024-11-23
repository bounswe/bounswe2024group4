import React, { useState, useContext } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../assets/Animation1.json"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";  
import { setLoggedIn } from "../components/Auth.js";
import { Context } from "../globalContext/globalContext.js";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  
  const [loading, setLoading] = useState(false); 
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const navigate = useNavigate();  

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);  
    setError("");  

    try {
      const csrfTokenResp = await axios.get(baseURL + "/csrf_token/");
      console.log(csrfTokenResp.data.csrf_token);
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrfTokenResp.data.csrf_token,
        },
      };
      const response = await axios.post(baseURL + "/log_in/", {
        username,
        password,
      }, config);
      localStorage.setItem("csrfToken", csrfTokenResp.data.csrf_token);

      localStorage.setItem("username", username);
      console.log("Login successful", response.data);
      setLoggedIn("true");
      
      navigate("/meals");  
      console.log("username:",localStorage.getItem("username"))
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 401) {
        setError("Invalid credentials, please try again.");  
      } else {
        setError("An error occurred. Please try again.");  
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-900">
      <div className="bg-blue-800 text-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-2xl mb-6 font-bold text-center">Fitness & Diet Forum</h1>
        <form onSubmit={handleLogin}>
          <label className="block mb-2">Username</label>
          <input
            type="text"
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
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            disabled={loading} // Loading durumu aktifken buton devre dışı
          >
            {loading ? "Logging In..." : "Sign In"}
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





import React, { useState } from 'react';
import "../css/index.css";
import { Navbar } from '../components/Navbar';
import axios from 'axios';
import Cookies from 'js-cookie';

function SignIn() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const baseURL = 'http://127.0.0.1:8000';
      const config = {
        withCredentials: true,
        headers: {
          'Content-Type': "multipart/form-data",
          'X-CSRFToken': Cookies.get("csrftoken"),
        }
      }

      const response = await axios.post(baseURL + '/login/', formData, config);

      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className= "bg-nba min-h-screen bg-top-left">
        <Navbar />
        <main className="container mx-auto mt-40">
          <div className="signup-form">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md w-1/2">
            <h1 className="text-3xl font-bold text-blue-500 mb-4">Welcome back to NBA Forum!</h1>
              <input type="text" name="username" placeholder="Username" required className="border p-2 rounded-md mb-4 w-full" />
              <input type="password" name="password" placeholder="Password" required className="border p-2 rounded-md mb-4 w-full" />
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-md">SIGN IN</button>
            </form>
          </div>
        </main>
      </div>
  );
}

export default SignIn;
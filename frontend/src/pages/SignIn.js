import React, { useContext, useState } from 'react';
import "../css/index.css";
import { Navbar } from '../components/Navbar';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Context } from "../globalContext/globalContext.js";

const SignIn = () => {
  const globalContext = useContext(Context);
  const { setIsLoggedIn, isLoggedIn, baseURL, hasSession, setUserObj, setHasSession } = globalContext;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrorMessage('');
  };

  const [formErrorMessage, setFormErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const csrf_token = await axios.get(baseURL + '/csrf_token/');
      const config = {
        withCredentials: true,
        headers: {
          'Content-Type': "multipart/form-data",
          'X-CSRFToken': Cookies.get('csrftoken'),
        }
      };

      const response = await axios.post(baseURL + '/login/', formData, config);
      if (response.status === 200) {
        setHasSession(true);
        setUserObj(response.data);
        setIsLoggedIn(true);
        console.log(hasSession);
      }
      else {
        setFormErrorMessage('Invalid login, check if username and password are correct.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className= "bg-nba min-h-screen bg-top-left">
        <Navbar />
        <main className="container mx-auto mt-40">
          <div className="signin-form">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md w-1/2">
            <h1 className="text-3xl font-bold text-blue-500 mb-4">Welcome back to NBA Forum!</h1>
              <input type="text" name="username" placeholder="Username" required className="border p-2 rounded-md mb-4 w-full" onChange={handleChange} />
              <input type="password" name="password" placeholder="Password" required className="border p-2 rounded-md mb-4 w-full" onChange={handleChange} />
              { formErrorMessage !== '' && <p className="text-red-500 mb-4">{formErrorMessage}</p>}
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-md">SIGN IN</button>
            </form>
          </div>
        </main>
      </div>
  );
}

export default SignIn;
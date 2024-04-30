import React, { useState } from 'react';
import "../css/index.css";
import { Navbar } from '../components/Navbar';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
axios.defaults.validateStatus = () => true;

function SignUp() {
  const navigate = useNavigate();
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  });

  const [formErrorMessage, setFormErrorMessage] = useState('')

  const validateEmail = (emailAddress) => {
    console.log(emailAddress);
    let reg = /\w+@\w+\.\w+/;
    return reg.test(emailAddress)
  }

  const validateUsername = (username) => {
    if (username === '')
      return false;
    let reg = /^[A-Za-z0-9_]*$/;
    return reg.test(username)
  }

  const validatePassword = (password) => {
    if (password === '')
      return false;
    let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return reg.test(password)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateUsername(formData.username)) {
      setFormErrorMessage('Please enter a username that only contains upper or lowercase letters, numbers and/or underscore.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setFormErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setFormErrorMessage('Please enter a valid password that contains at least 8 characters, including at least 1 number, 1 special character, 1 uppercase and 1 lowercase letter.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setFormErrorMessage('Please make sure you enter the same password.');
      return;
    }

    try {
      await axios.get(baseURL + '/csrf_token/');
      const config = {
        withCredentials: true,
        headers: {
          'Content-Type': "multipart/form-data",
          'X-CSRFToken': Cookies.get("csrftoken"),
        }
      }
      const { confirm_password, ...sentData } = formData;

      const response = await axios.post(baseURL + '/signup/', sentData, config);
      
      if (response.status === 200) {
        navigate('/sign-in');
      }
      else {
        setFormErrorMessage('Email or username may be taken.');
      }

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
            <h1 className="text-3xl font-bold text-blue-500 mb-8">Welcome to NBA Forum!</h1>
              <input type="text" name="username" placeholder="Username" required className="border p-2 rounded-md mb-4 w-full" onChange={handleChange} />
              <input type="mail" name="email" placeholder="Email" required className="border p-2 rounded-md mb-4 w-full" onChange={handleChange} />
              <input type="password" name="password" placeholder="Password" required className="border p-2 rounded-md mb-4 w-full" onChange={handleChange}/>
              <input type="password" name="confirm_password" placeholder="Confirm Password" required className="border p-2 rounded-md mb-8 w-full" onChange={handleChange} />
              { formErrorMessage !== '' && <p className="text-red-500 mb-4">{formErrorMessage}</p>}
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-full px-4 py-2 rounded-md">Sign up</button>
            </form>
          </div>
        </main>
      </div>
  );
}

export default SignUp;
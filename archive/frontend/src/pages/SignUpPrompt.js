import React from 'react';
import "../css/index.css";
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function SignUpPrompt() {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/sign-up');
  };

  const handleSignIn = () => {
    // Navigate to sign in page
    navigate('/sign-in');
  };

  
  return (
    <div className= "bg-nba min-h-screen bg-top-left">
        <Navbar />
        <main className="container mx-auto mt-40">
          <div className="signup-popup">
            <div className="bg-white p-6 rounded-md shadow-md w-1/2">
              <h1 className="text-3xl font-bold text-black-500 mb-4">You need to sign in to create a post!</h1>
              <button type="sign-in" className="bg-blue-500 hover:bg-blue-700 mx-auto text-white font-bold px-6 py-3 rounded-md" onClick={handleSignIn} >SIGN IN</button>
              <h2 className="text-3xl font-bold text-black-500 mb-4 mt-4">Don't have an account?</h2>
              <button type="submit" className="bg-nba-pink hover:bg-nba-pink-darker text-white font-bold px-6 py-3 rounded-md" onClick={handleSignUp}>SIGN UP</button>
            </div>
          </div>
        </main>
      </div>
  );
}

export default SignUpPrompt;
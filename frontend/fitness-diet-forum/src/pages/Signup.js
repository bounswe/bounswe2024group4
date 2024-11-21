import React from "react";

const Signup = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-900">
      <div className="bg-blue-800 text-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-xl mb-4 font-bold text-center">Sign Up</h1>
        <form>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 mb-4 border rounded text-black"
            placeholder="Email"
          />
          <label className="block mb-2">Username</label>
          <input
            type="username"
            className="w-full px-3 py-2 mb-4 border rounded text-black"
            placeholder="Username"
          />
          <label className="block mb-2">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 mb-4 border rounded text-black"
            placeholder="Password"
          />
          <label className="block mb-2">Confirm Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 mb-4 border rounded text-black"
            placeholder="Confirm Password"
          />
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

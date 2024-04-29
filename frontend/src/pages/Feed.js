import React from "react";
import { Navbar } from "../components/Navbar";

const Feed = () => {
  const username = localStorage.getItem("username");
  return (
    <div className="bg-white h-screen">
      <div className="w-full">
        <Navbar />
      </div>
      <div className="flex justify-center items-center h-full ">
        <div className="bg-blue-500 rounded-lg p-10 max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome, {username}!</h1>
          <p className="text-lg mb-8">
            This page will show your feed when the project is done.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feed;

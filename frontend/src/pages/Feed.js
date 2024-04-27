import React from 'react';
import { Navbar } from '../components/Navbar';

const Feed = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <img
        src="https://upload.wikimedia.org/wikipedia/en/c/c5/Bob_the_builder.jpg"
        className="mb-4 mx-auto h-1/2"
      />
      <h1 className="text-3xl font-bold text-center">WORK IN PROGRESS</h1>
    </div>
  );
};

export default Feed;
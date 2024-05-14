import React, { useContext, useState, useEffect } from 'react';
import PostBottomBar from './PostBottomBar';
import {formatDistanceToNowStrict} from "date-fns";
import { Context } from "../globalContext/globalContext.js";
import axios from 'axios';

function Post({ author, postId, createdAt, image }) {
  const [content, setContent] = useState('');
  const [imageURL, setImageURL] = useState('');
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const handleData = async () => {
    try {
      const response = await axios.get(baseURL + '/post_detail/?post_id=' + postId);
      setContent(response.data.post);
      setImageURL(baseURL + response.data.image);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    handleData();
  }, []);

	return (
		<div className="border border-gray-300 rounded-md overflow-hidden mb-2">
			<div className="bg-white shadow-md p-4 hover:bg-slate-50">
        <div className='flex gap-4'>
          <img src={author.avatar} alt={author.name} className="w-12 h-12 rounded-full" />
          <div className='w-full'>
            <div className="flex items-center mb-2 gap-2">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{author.name}</h2>
                    <p className="text-gray-500 text-sm">{formatDistanceToNowStrict(createdAt, { addSuffix: true })}</p>
                </div>
            </div>
            <p className="text-gray-800 mb-4">{content}</p> 
            {image && 
                <img src={imageURL} alt="" className="rounded-3xl mb-4 object-cover min-w-96 max-h-[55vh]" />
            }
            <PostBottomBar />
          </div>
        </div>
      </div>
		</div>
	);
}

export default Post;
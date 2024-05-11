import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Context } from "../globalContext/globalContext.js"
import axios from 'axios';

const Feed = () => {

  const globalContext = useContext(Context)
  const { baseURL } = useContext(Context);
  const userObj = globalContext.userObj;
  const [ postIds, setPostIds ] = useState([1,2,3,4,5,6]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ posts, setPosts] = useState([]);
//  console.log("user object:", userObj)

  useEffect(() => {
    const fetchFollowedProfilesPosts = async () => {
      try {
        const response = await axios.get(`${baseURL}/user_followings/`);
 //       console.log(response.data)
        //TODO: get the post id's of all the following users

        if (response.status === 200) {
          console.log('OK:', response.data);
        } else {
          console.log('FAIL', response.status);
        }
      } catch (error) {
        console.error('Error getting the following users', error);
      }
      
    };
    fetchFollowedProfilesPosts();
    setIsLoading(false);
  }, []);

  const renderPostItem = ({ post }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postText}>{post?.content}</Text>
      <View style={styles.commentContainer}>
        {post?.comments.map((comment) => (
          <Text style={styles.postText}>{comment.content}</Text>
        ))}
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => handleLike(post?.id)} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleComment(post?.id)} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleCreatePost = () => {
    // Navigate to the screen where users can create a new post
  };

  // Handler for liking a post
  const handleLike = (postId) => {

  };

  // Handler for commenting on a post
  const handleComment = (postId) => {
    // Implement logic to navigate to the screen where users can comment on the post
  };

  return (
    (!isLoading)? (
    <View style={styles.container}>
      <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(post) => post.id}
        />
      <TouchableOpacity style={styles.createPostButton} onPress={handleCreatePost}>
        <Text><Text style={styles.createPostButtonText}>Create a Post</Text></Text> 
      </TouchableOpacity>
    </View>)
    :(
      <View style={styles.scrollContainer}>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  createPostButton: {
    backgroundColor: "#1B64EB",
    fontSize: 18,
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  createPostButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  postContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  postText: {
    fontSize: 16,
    marginBottom: 10,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Feed;
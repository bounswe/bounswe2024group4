import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Context } from "../globalContext/globalContext.js"

const Feed = () => {

  const globalContext = useContext(Context)
  const userObj = globalContext.userObj
  const [posts, setPosts] = useState([]);
//  console.log("user object:", userObj)


  const handleCreatePost = () => {
    // Navigate to the screen where users can create a new post
  };

  // Handler for liking a post
  const handleLike = (postId) => {
    // Implement logic to like the post
  };

  // Handler for commenting on a post
  const handleComment = (postId) => {
    // Implement logic to navigate to the screen where users can comment on the post
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.createPostButton} onPress={handleCreatePost}>
        <Text><Text style={styles.createPostButtonText}>Create a Post</Text></Text> 
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignItems: 'center'
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
});

export default Feed;
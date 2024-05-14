import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Context } from "../globalContext/globalContext.js"
import axios from 'axios';

const Feed = () => {
  const { baseURL } = useContext(Context);
  const [ postIds, setPostIds ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ posts, setPosts ] = useState([]);
  const [ liked, setLiked ] = useState(false);
  const [ bookmarked, setBookmarked ] = useState(false);

  useEffect(() => {
    const fetchFollowedProfilesPosts = async () => {
      try {
       
        //TODO: get the post id's of all the following users
        const idResponse = await axios.get(`${baseURL}/feed/`);
        setPostIds(idResponse.data.post_ids);
      } catch (error) {
        console.error('Error getting the following users', error);
      }
      
      const fetchedPosts = [];
      // Loop through the list of post_ids and fetch individual posts
      for (const postId of postIds) {
        setIsLoading(true);
        try {
          const response = await axios.get(`${baseURL}/post_detail/?post_id=${postId}`);
          fetchedPosts.push(response.data);

        } catch (error) {
          console.error('Error fetching post:', error);
        }
      }
      // Set the fetched posts in state
      setPosts(fetchedPosts);
      setIsLoading(false);
      console.log(posts);
    };
    fetchFollowedProfilesPosts();
    
  }, []);

  const renderPostItem = ({ item }) => {
    console.log('Post ID:', item.id);

    return (
    <View style={styles.postContainer}>
      <View style={styles.userInfoContainer}>
        <Image
          source={{ uri: '/Users/buseaydin/Desktop/bounswe2024group4/backend/media/profile_pictures/default_nba_app_pp.jpg' }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>Zbuse</Text>
      </View>

      <Text style={styles.postText}>{item.post}</Text>
        {item.image ? (
        <Image
          source={{ uri: baseURL + item.image }}
          style={styles.postImage}
        />
      ) : null}
      <View style={styles.actionsContainer}>
      <TouchableOpacity onPress={handleLike} style={[styles.actionButton]}>
        <Icon name={liked ? 'heart' : 'heart-o'} size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleComment} style={styles.actionButton}>
        <Icon name='comments' size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBookmark} style={[styles.actionButton]}>
        <Icon name={bookmarked ? 'bookmark' : 'bookmark-o'} size={20} color="#fff" />
      </TouchableOpacity>
      </View>
    </View>
  )};

  const handleCreatePost = () => {
    // Navigate to the screen where users can create a new post
  };


  // TODO: Handler for liking a post 
  const handleLike = () => {
    setLiked(!liked); 
  };

  // TODO: Handler for bookmarking a post 
  const handleBookmark = () => {
    setBookmarked(!bookmarked); 
  };

  // Handler for commenting on a post
  const handleComment = (postId) => {
    // Implement logic to navigate to the screen where users can comment on the post
  };

  return (
    <View style={styles.container}>
      {!isLoading ? (
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <ActivityIndicator size="large" color="#ffff" />
      )}
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
    backgroundColor: '#55A1E6',
  },
  createPostButton: {
    backgroundColor: "#CE4800",
    fontSize: 18,
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  createPostButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  postContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BCBCBC',
  },
  postText: {
    fontSize: 16,
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  postImageContainer: {
    width: '100%', // Ensure the container takes up the full width
    backgroundColor: '#f0f0f0',
  },
  postImage: {
    width: '100%', // Ensure the image takes up the full width of its container
    height: undefined, // Allow height to adjust automatically based on width
    aspectRatio: 16 / 16, // Set aspect ratio to 16:9 for landscape images
    resizeMode: 'contain',
  },
  actionButton: {
    backgroundColor: '#CE4800',
    padding: 10,
    borderRadius: 50, // Make it circular to create a heart shape
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Feed;
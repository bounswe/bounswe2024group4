import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Context } from "../globalContext/globalContext.js"
import axios from 'axios';
import moment from 'moment';

const Feed = ({ navigation }) => {
  const { baseURL } = useContext(Context);
  const [ postIds, setPostIds ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ posts, setPosts ] = useState([]);
  const [ liked, setLiked ] = useState(false);
  const [ bookmarked, setBookmarked ] = useState(false);

  useEffect(() => {
    const fetchFollowedProfilesPosts = async () => {
      try {
        const response = await axios.get(`${baseURL}/feed/`);
        const postIds = response.data.post_ids;
        setPostIds(postIds);
        const postRequests = postIds.map(postId => axios.get(`${baseURL}/post_detail/${postId}/`));
        const postResponses = await Promise.all(postRequests);
        const fetchedPosts = postResponses.map(response => response.data);
        setPosts(fetchedPosts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching followed profiles posts:', error);
        setIsLoading(false);
      }
    };
      fetchFollowedProfilesPosts();
  }, []);

  const renderPostItem = ({ item }) => {
    return (
      
    <View style={styles.postContainer}>

      <View style={styles.userInfoContainer}>
        <View style={styles.userDetails}>
          <Image
            source={{ uri: baseURL + item.profile_picture }}
            style={styles.profileImage}
          />
          <Text style={styles.username}>{item.username}</Text>
        </View>
        <Text>{moment(item.created_at).fromNow()}</Text>
      </View>

      <Text style={styles.postText}>{item.post}</Text>
        {item.image ? (
        <Image
          source={{ uri: baseURL + item.image }}
          style={styles.postImage}
        />
      ) : null}
      <View style={styles.actionsContainer}>
      <TouchableOpacity onPress={() => handleLike(item.post_id)} style={[styles.actionButton]}>
        <Icon name={item.user_has_liked ? 'heart' : 'heart-o'} size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleComment} style={styles.actionButton}>
        <Icon name='comments' size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBookmark} style={[styles.actionButton]}>
        <Icon name={item.user_has_bookmarked ? 'bookmark' : 'bookmark-o'} size={20} color="#fff" />
      </TouchableOpacity>
      </View>
    </View>
  )};

  // TODO: Handler for liking a post 
  const handleLike = async (post_id) => {
    try {
      const csrfToken = (await axios.get(baseURL + "/csrf_token/")).data
        .csrf_token;

      const response = await axios.post(baseURL + "/like_or_unlike_post/" + post_id, "", 
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      });

      if (response.status == 200) {

      } 
    } catch (error) {
      console.log(error.message);
    }
  };

  // TODO: Handler for bookmarking a post 
  const handleBookmark = () => {
    setBookmarked(!bookmarked); 
  };

  // Handler for commenting on a post
  const handleComment = (postId) => {
    // Implement logic to navigate to the screen where users can comment on the post
    navigation.navigate('Post')
  };

  return (
    <View style={styles.container}>
      {!isLoading ? (
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.post_id.toString()}
        />
      ) : (
        <ActivityIndicator size="large" color="#ffff" />
      )}
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
    marginRight: 5,
    borderRadius: 50, // Make it circular to create a heart shape
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default Feed;
import React, { useContext, useState, useEffect } from 'react';
import { Context } from "../globalContext/globalContext.js"
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

const Post = ({ post }) => {
  const { baseURL } = useContext(Context);

  // TODO: Handler for liking a post 
  const handleLike = () => {
  };

  // TODO: Handler for bookmarking a post 
  const handleBookmark = () => {
  };

  // Handler for commenting on a post
  const handleComment = (post) => {
    // Implement logic to navigate to the screen where users can comment on the post
    navigation.navigate('Post', post)
  };

  const isLiked = post.user_has_liked;

  return (
    <View style={styles.postContainer}>
      <View style={styles.userInfoContainer}>
        <View style={styles.userDetails}>
          <Image
            source={{ uri: baseURL + post.profile_picture }}
            style={styles.profileImage}
          />
          <Text style={styles.username}>{post.username}</Text>
        </View>
        <Text>{moment(post.created_at).fromNow()}</Text>
      </View>

      <Text style={styles.postText}>{post.post}</Text>
      {post.image && (
        <Image
          source={{ uri: baseURL + post.image }}
          style={styles.postImage}
        />
      )}
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
          <Icon name={isLiked ? 'heart' : 'heart-o'} size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleComment} style={styles.actionButton}>
          <Icon name='comments' size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBookmark} style={styles.actionButton}>
          <Icon name={post.user_has_bookmarked ? 'bookmark' : 'bookmark-o'} size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 5,
    justifyContent: 'space-between',
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

export default Post;

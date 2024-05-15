import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Post = ({ route }) => {
    const post = route.params;
    console.log(post);

    // TODO: Handler for liking a post 
    const handleLike = () => {
    };

    // TODO: Handler for bookmarking a post 
    const handleBookmark = () => {
    };

    const handleComment = () => {
    };

  return (
    <View style={styles.container}>
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <Text style={styles.username}>--username--</Text>
        <Text style={styles.time}>--time--</Text>
      </View>
      <Text style={styles.content}>{post.post}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleLike} style={styles.actionButton}>
          <Icon name={post.user_has_liked ? 'heart' : 'heart-o'} size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleComment} style={styles.actionButton}>
          <Icon name='comment' size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleBookmark} style={styles.actionButton}>
          <Icon name={post.user_has_bookmarked ? 'bookmark' : 'bookmark-o'} size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.stats}>
        <Text style={styles.likes}>{   } likes</Text>
        <Text style={styles.comments}>{} comments</Text>
      </View>
      {/* Add comment input field and button here */}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#55A1E6',
  },
  postContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BCBCBC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  username: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  time: {
    color: '#777',
  },
  content: {
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  actionButton: {
    backgroundColor: '#CE4800',
    padding: 10,
    marginRight: 5,
    borderRadius: 50, // Make it circular to create a heart shape
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likes: {
    fontWeight: 'bold',
  },
  comments: {
    color: '#777',
  },
});

export default Post;

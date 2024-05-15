import React, { useContext, useState } from 'react';
import { Context } from "../globalContext/globalContext.js"
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import axios from 'axios';

const Post = ({ post }) => {
  const { baseURL } = useContext(Context);
  const [ showComments, setShowComments ] = useState(false);
  const [ commentText, setCommentText ] = useState('');
  const [ comments, setComments ] = useState(post.comments);
  const [ isLiked, setIsLiked ] = useState(post.user_has_liked);
  const [ isBookmarked, setIsBookmarked ] = useState(post.user_has_bookmarked);
  const [ likesCount, setLikesCount ] = useState(post.likes_count);

  const handleLike = async () => {
    const previousLikesCount = likesCount;
    const previousIsLiked = isLiked;
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked((prev) => !prev);
    
    try {
      const csrfToken = (await axios.get(baseURL + "/csrf_token/")).data
        .csrf_token;
      const response = await axios.post(
        baseURL + "/like_or_unlike_post/" + post.post_id,
        "",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
        }
      );
      if (response.status !== 200) {
        setLikesCount(previousLikesCount);
        setIsLiked(previousIsLiked);
      }
    } catch (error) {
      console.error("Error liking the post:", error);
      setLikesCount(previousLikesCount);
      setIsLiked(previousIsLiked);
    }
  };

  const handleBookmark = async () => {
    const prevIsBookmarked = isBookmarked;
    setIsBookmarked((prev) => !prev);

    // send request, if fails revert the changes
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleComment = async () => {
    if (commentText.trim()){
      try {
        const csrfToken = (await axios.get(baseURL + "/csrf_token/")).data
          .csrf_token;
        console.log(commentText);
        var formData = new FormData();
        formData.append("content", commentText);
        setCommentText(''); // Clear comment text after submitting

        const response = await axios.post(
          baseURL + "/post/" + post.post_id + "/comment/", formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
              "X-CSRFToken": csrfToken,
            },
          }
        );
        setComments(response.data.comments);
        if (response.status !== 200) {
          console.log("Couldn't comment on the post");
        }
      } catch (error) {
        console.error("Error commenting on the post:", error);
      }
    }
  };

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
        <View style={styles.likeContainer}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <Icon name={isLiked ? 'heart' : 'heart-o'} size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.likeCount}>{likesCount}</Text>
        </View>
        <View style={styles.userDetails}>
          <TouchableOpacity onPress={toggleComments} style={styles.actionButton}>
            <Icon name='comments' size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBookmark} style={styles.actionButton}>
            <Icon name={isBookmarked ? 'bookmark' : 'bookmark-o'} size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

        {showComments && (
          <View style={styles.commentsContainer}>
            {/* Display comments */}
            {comments.map((comment, index) => (
              <Text key={index} style={styles.comment}>{comment.content}</Text>
            ))}
            {/* Create a comment */}
            <View style={styles.createCommentContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity onPress={handleComment} style={styles.commentButton}>
                <Text style={styles.commentButtonText}>Comment</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
    justifyContent: 'space-between',
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
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  commentsContainer: {
    marginTop: 10,
  },
  comment: {
    marginBottom: 5,
  },
  createCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  commentButton: {
    backgroundColor: '#CE4800',
    borderRadius: 10,
    padding: 7,
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 5,
  },
});

export default Post;
import React, { useContext, useState } from 'react';
import { Context } from "../globalContext/globalContext.js"
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBookmark as sBookmark, faHeart as sHeart, faComment as sComment } from '@fortawesome/free-solid-svg-icons';
import { faBookmark, faHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import RenderHTML from 'react-native-render-html';
import moment from 'moment';
import axios from 'axios';
import Comment from "./Comment.js";


const Post = ({ post, navigation }) => {
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

    try {
      const csrfToken = (await axios.get(baseURL + "/csrf_token/")).data
        .csrf_token;
      const response = await axios.post(baseURL + "/bookmark_or_unbookmark_post/" + post.post_id, "", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      });
      if (response.status !== 200) {
        setIsBookmarked(prevIsBookmarked);
      }
    } catch (error) {
      console.error("Error bookmarking the post:", error);
      setIsBookmarked(prevIsBookmarked);
    }
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
        console.log(comments);
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
      <TouchableOpacity style={styles.userInfoContainer} onPress={() => navigation.navigate('OthersProfile', { username: post.username })}>
        <View style={styles.userDetails}>
          <Image
            source={{ uri: baseURL + post.profile_picture }}
            style={styles.profileImage}
          />
          <Text style={styles.username}>{post.username}</Text>
        </View>
        <Text>{moment(post.created_at).fromNow()}</Text>
      </TouchableOpacity>

      <View style={styles.separator} />
      <RenderHTML contentWidth={300} source={{ html: post.post }} />

      {post.image && (
        <Image
          source={{ uri: baseURL + post.image }}
          style={styles.postImage}
        />
      )}

      <View style={styles.separator} />
      <View style={styles.actionsContainer}>
        <View style={styles.likeContainer}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <FontAwesomeIcon icon={isLiked ? sHeart : faHeart} size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.likeCount}>{likesCount}</Text>
        </View>
        <View style={styles.userDetails}>
          <TouchableOpacity onPress={toggleComments} style={styles.actionButton}>
            <FontAwesomeIcon icon={showComments ? sComment : faComment} size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBookmark} style={styles.actionButton}>
            <FontAwesomeIcon icon={isBookmarked ? sBookmark : faBookmark} size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

        {showComments && (
          <View style={styles.commentsContainer}>
          {
              <FlatList
                data={comments}
                renderItem={({ item }) => (
                  <Comment
                    comment={item}
                    navigation={navigation}
                  />
                )}
                keyExtractor={(item) => item.id}
                />
              }
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
    marginBottom: 1,
    justifyContent: 'space-between',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F9FF'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 10,
    margin: 3,
    borderRadius: 8,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  smallProfileImage: {
    width: 35,
    height: 35,
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
  smallUsername: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  commentsContainer: {
    marginTop: 10,
    width: '%100'
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
  separator: {
    height: 1,
    backgroundColor: '#BCBCBC',
    marginVertical: 10,
  },
});

export default Post;

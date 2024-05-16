import React, { useContext, useState } from 'react';
import { Context } from "../globalContext/globalContext.js"
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHeart as sHeart} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';

const Comment = ({ comment, navigation }) => {
  const { baseURL } = useContext(Context);
  const [ isLiked, setIsLiked ] = useState(comment.liked_by_user);
  const [ likesCount, setLikesCount ] = useState(comment.likes_count);

  const handleLike = async () => {
    const previousLikesCount = likesCount;
    const previousIsLiked = isLiked;
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked((prev) => !prev);
    
    try {
      const csrfToken = (await axios.get(baseURL + "/csrf_token/")).data
        .csrf_token;
      const response = await axios.post(
        baseURL + "/like_or_unlike_comment/" + comment.id,
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
      console.error("Error liking the comment:", error);
      setLikesCount(previousLikesCount);
      setIsLiked(previousIsLiked);
    }
  };

  return (
    <View style={styles.row}>
        <View style={styles.userDetails}>
            <TouchableOpacity onPress={() => navigation.navigate('OthersProfile',  {username: comment.comment_username} )}>
                <View style={{alignItems: 'flex-start'}}>
                    <Image source={{ uri: baseURL + comment.comment_user_pp }} style={styles.smallProfileImage} />
                </View>
            </TouchableOpacity>
            <View>
                <TouchableOpacity onPress={() => navigation.navigate('OthersProfile',  {username: comment.comment_username} )}>
                    <Text style={styles.smallUsername}>{comment.comment_username}</Text>
                </TouchableOpacity>
                <Text>{comment.content}</Text>
            </View>
        </View>
        <View style={styles.likeContainer}>
                <Text style={styles.likeCount}>{likesCount}</Text>
                <TouchableOpacity onPress={() => handleLike(comment.id)} style={styles.actionButton}>
                    <FontAwesomeIcon icon={isLiked ? sHeart : faHeart} size={20} color="#CE4800" />
                </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: '#fff',
    color: '#CE4800',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#CE4800',
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
    maxWidth: '%80',
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
    maxWidth: '60%'
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

export default Comment;

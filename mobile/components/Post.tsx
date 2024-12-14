import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBookmark as sBookmark, faHeart as sHeart, faComment as sComment } from '@fortawesome/free-solid-svg-icons';
import { faBookmark, faHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'http://' + process.env.EXPO_PUBLIC_API_URL + ':8000';

const Post = ({ postId, user, content, mealId, workoutId, like_count, liked, onLikeUpdate }) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [likesCount, setLikesCount] = useState(like_count);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [workout, setWorkout] = useState(null);
  const [meal, setMeal] = useState(null);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setIsLiked(liked);
    setLikesCount(like_count);
  }, [liked, like_count]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Token ${token}`,
          },
        };

        if (mealId) {
          const mealResponse = await axios.get(`${baseURL}/get-meal/${mealId}`, config);
          if (mealResponse.status === 200) {
            setMeal(mealResponse.data);
          }
        }

        if (workoutId) {
          const workoutResponse = await axios.get(`${baseURL}/get-workout/${workoutId}`, config);
          if (workoutResponse.status === 200) {
            setWorkout(workoutResponse.data);
          }
        }
      } catch (error) {
        setError('Failed to fetch post data');
        console.error('Error fetching post data:', error);
      }
    };

    fetchPostData();
  }, [mealId, workoutId]);
  
  const handleWorkoutUpdate = (updatedWorkout) => {
    setWorkout(updatedWorkout);
  };

  const handleLike = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const updatedIsLiked = !isLiked;
      const updatedLikesCount = likesCount + (isLiked ? -1 : 1);
  
      setIsLiked(updatedIsLiked);
      setLikesCount(updatedLikesCount);
      
      onLikeUpdate(postId, updatedIsLiked, updatedLikesCount);
  
      const response = await axios.post(
        `${baseURL}/toggle_like/`,
        { postId: postId },
        {
          headers: {
            'Authorization': `Token ${token}`,
          },
        }
      );
  
      if (response.status !== 200) {
        setIsLiked(!updatedIsLiked);
        setLikesCount(updatedLikesCount + (updatedIsLiked ? -1 : 1));
        onLikeUpdate(postId, !updatedIsLiked, updatedLikesCount + (updatedIsLiked ? -1 : 1));
        throw new Error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error.response?.data || error);
      setIsLiked(!updatedIsLiked);
      setLikesCount(updatedLikesCount + (updatedIsLiked ? -1 : 1));
      onLikeUpdate(postId, !updatedIsLiked, updatedLikesCount + (updatedIsLiked ? -1 : 1));
    }
  };

  const handleBookmark = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${baseURL}/toggle_bookmark/`,
        { postId },
        {
          headers: {
            'Authorization': `Token ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const toggleComments = async () => {
    if (!showComments) {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(
          `${baseURL}/get_comments/${postId}`,
          {
            headers: {
              'Authorization': `Token ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setComments(response.data);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
    setShowComments(!showComments);
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.userInfoContainer}>
        <View style={styles.userDetails}>
          <Image 
            source={{ uri: user.profile_picture }} 
            style={styles.profileImage} 
          />
          <View style={styles.userTextContainer}>
            <Text style={styles.username}>@{user.username}</Text>
            {user.rating && (
              <View style={styles.ratingContainer}>
                <Rating
                  type="star"
                  startingValue={user.rating}
                  imageSize={16}
                  readonly
                  tintColor="#0F172A"
                  ratingColor="#FFD700"
                  ratingBackgroundColor="#333"
                />
                <Text style={styles.ratingText}>{user.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <Text style={styles.postContent}>{content}</Text>

      {meal && (
        <View style={styles.contentCard}>
          <Text style={styles.contentTitle}>Meal Details</Text>
          {/* Add the Meal component here */}
        </View>
      )}

      {workout && (
        <View style={styles.workoutContainer}>
          <WorkoutProgram 
            workout={workout}
            onUpdate={handleWorkoutUpdate}
          />
        </View>
      )}

      <View style={styles.actionsContainer}>
        <View style={styles.leftActions}>
          <TouchableOpacity 
            onPress={handleLike} 
            style={styles.actionButton}
          >
            <FontAwesomeIcon 
              icon={isLiked ? sHeart : faHeart} 
              size={20} 
              color={isLiked ? '#60A5FA' : '#94A3B8'} 
            />
            <Text style={styles.actionText}>
              {likesCount} Like
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={toggleComments} 
            style={styles.actionButton}
          >
            <FontAwesomeIcon 
              icon={faComment} 
              size={20} 
              color="#94A3B8" 
            />
            <Text style={styles.actionText}>
              Comment
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={handleBookmark} 
          style={styles.actionButton}
        >
          <FontAwesomeIcon 
            icon={isBookmarked ? sBookmark : faBookmark} 
            size={20} 
            color={isBookmarked ? '#60A5FA' : '#94A3B8'} 
          />
        </TouchableOpacity>
      </View>

      {showComments && (
        <View style={styles.commentsContainer}>
          {comments.map((comment, index) => (
            <View key={index} style={styles.commentItem}>
              <Text style={styles.commentText}>{comment}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#0F172A',
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  userInfoContainer: {
    marginBottom: 12,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E293B',
  },
  userTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFD700',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  postContent: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 12,
    lineHeight: 24,
  },
  contentCard: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  commentsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 16,
  },
  commentItem: {
    marginBottom: 12,
  },
  commentText: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
  },
});

export default Post;
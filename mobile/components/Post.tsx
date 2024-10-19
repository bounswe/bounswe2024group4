import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings'; // Importing react-native-ratings component
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBookmark as sBookmark, faHeart as sHeart, faComment as sComment } from '@fortawesome/free-solid-svg-icons';
import { faBookmark, faHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import moment from 'moment';

// Interface for the Post props
interface PostProps {
  post: {
    id: string;
    username: string;
    profile_picture: string;
    content: string;
    image?: string; 
    created_at: Date;
    likes_count: number;
    user_has_liked: boolean;
    user_has_bookmarked: boolean;
    user_rating: number; 
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.user_has_liked);
  const [isBookmarked, setIsBookmarked] = useState(post.user_has_bookmarked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <View style={styles.postContainer}>
      {/* User Info and Rating */}
      <View style={styles.userInfoContainer}>
        <View style={styles.userDetails}>
          <Image source={{ uri: post.profile_picture }} style={styles.profileImage} />
          <View>
            <Text style={styles.username}>{post.username}</Text>
            <View style={styles.ratingContainer}>
              <Rating
                type="star"
                startingValue={post.user_rating} 
                imageSize={16} 
                readonly 
                tintColor="#1e1e1e" 
              />
              {/* Displaying the rating next to the stars */}
              <Text style={styles.ratingText}>{post.user_rating} / 5</Text>
            </View>
          </View>
        </View>
        <Text style={styles.postTime}>{moment(post.created_at).fromNow()}</Text>
      </View>

      <View style={styles.separator} />

      {/* Post Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Post Image (if available) */}
      {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}

      <View style={styles.separator} />

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <View style={styles.likeContainer}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <FontAwesomeIcon icon={isLiked ? sHeart : faHeart} size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.likeCount}>{likesCount}</Text>
        </View>

        <TouchableOpacity onPress={toggleComments} style={styles.actionButton}>
          <FontAwesomeIcon icon={faComment} size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBookmark} style={styles.actionButton}>
          <FontAwesomeIcon icon={isBookmarked ? sBookmark : faBookmark} size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Comments */}
      {showComments && <Text style={styles.commentsPlaceholder}>Comments...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#0B2346',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#5C90E0',
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFD700', 
    marginLeft: 10,  
    fontSize: 14,
  },
  postTime: {
    color: '#bbb',
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#5C90E0',
    marginVertical: 10,
  },
  postContent: {
    color: '#fff',
    marginBottom: 10,
    fontSize: 16,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    padding: 10,
    backgroundColor: '#1B55AC',
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    color: '#fff',
    marginLeft: 5,
  },
  commentsPlaceholder: {
    color: '#aaa',
    marginTop: 10,
  },
});

export default Post;

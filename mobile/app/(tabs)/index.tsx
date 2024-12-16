import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import Post from '../../components/Post';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const PostFeed = () => {
  const router = useRouter();
  const baseURL = 'http://' + process.env.EXPO_PUBLIC_API_URL + ':8000';
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(true);

  const fetchFeed = useCallback(async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      const token = await AsyncStorage.getItem('token');
      
      if (!username || !token) {
        setError('Please log in to view your feed');
        setIsLoading(false);
        setIsPolling(false);
        return;
      }

      const response = await axios.get(`${baseURL}/following_feed`, {
        params: { username },
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (response.status === 200) {
        setPosts(response.data.posts);
      } else {
        setError('Failed to fetch posts');
      }
    } catch (err) {
      setError('Something went wrong');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [baseURL]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  useEffect(() => {
    if (!isPolling) return;

    const pollInterval = setInterval(() => {
      fetchFeed();
    }, 5000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [fetchFeed, isPolling]);

  useEffect(() => {
    return () => {
      setIsPolling(false);
    };
  }, []);

  const handlePostLikeUpdate = (postId, liked, likeCount) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.post_id === postId
          ? { ...post, liked: liked, like_count: likeCount }
          : post
      )
    );
    
    setIsPolling(false);
    setTimeout(() => setIsPolling(true), 2000);
  };

  const renderPost = ({ item }) => (
    <Post
      key={item.post_id}
      postId={item.post_id}
      user={item.user}
      content={item.content}
      mealId={item.meal_id}
      workoutId={item.workout_id}
      like_count={item.like_count}
      liked={item.liked}
      onLikeUpdate={handlePostLikeUpdate}
    />
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Your Feed</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Feed</Text>
      {isLoading ? (
        <View style={styles.centerContainer}>
          <Text style={styles.text}>Loading...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.post_id.toString()}
            extraData={posts}
            removeClippedSubviews={false}
            windowSize={5}
            maxToRenderPerBatch={5}
            updateCellsBatchingPeriod={30}
          />
          <TouchableOpacity
            onPress={() => router.push('../createPostScreen')}
            style={styles.addButton}
          >
            <FontAwesome5 name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1f26',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  feedContainer: {
    paddingVertical: 10,
    paddingBottom: 80,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 15,
    backgroundColor: '#ff000020',
    borderRadius: 8,
    marginVertical: 10,
  },
  errorText: {
    color: '#ff0000',
    textAlign: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    width: 50,
    height: 50,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default PostFeed;
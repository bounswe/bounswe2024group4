import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Post from "../components/Post";

interface BookmarkPost {
  post_id: number;
  user: {
    username: string;
    profile_picture?: string | null;
    rating?: number;
  };
  content: string;
  meal_id?: number | null;
  workout_id?: number | null;
  like_count: number;
  liked: boolean;
}

const BookmarkScreen: React.FC = () => {
  const baseURL = `http://${process.env.EXPO_PUBLIC_API_URL || "localhost"}:8000`;
  const [bookmarkedPosts, setBookmarkedPosts] = useState<BookmarkPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookmarkedPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setError("Authentication token is missing");
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`${baseURL}/bookmarked_posts/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 200) {
        setBookmarkedPosts(response.data.bookmarked_posts);
      } else {
        setError("Failed to fetch bookmarked posts");
      }
    } catch (err) {
      setError("Something went wrong while fetching bookmarked posts");
      console.error("Error fetching bookmarked posts:", err);
    } finally {
      setIsLoading(false);
    }
  }, [baseURL]);

  useEffect(() => {
    fetchBookmarkedPosts();
  }, [fetchBookmarkedPosts]);

  const handlePostLikeUpdate = (
    postId: number,
    liked: boolean,
    likeCount: number
  ) => {
    setBookmarkedPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.post_id === postId
          ? { ...post, liked, like_count: likeCount }
          : post
      )
    );
  };

  const renderPost = ({ item }: { item: BookmarkPost }) => (
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookmarkedPosts();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading Bookmarked Posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bookmarked Posts</Text>
      {bookmarkedPosts.length > 0 ? (
        <FlatList
          data={bookmarkedPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.post_id.toString()}
          contentContainerStyle={[styles.listContainer, { paddingBottom: 30 }]} 
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
            />
          }
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.noPostsText}>No bookmarked posts found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1f26",
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 10,
  },
  errorText: {
    color: "#FF0000",
    fontSize: 16,
    textAlign: "center",
  },
  noPostsText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default BookmarkScreen;

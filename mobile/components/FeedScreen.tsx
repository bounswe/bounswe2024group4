import React from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import Post from '../components/Post';

interface PostType {
  post_id: number;
  user: {
    username: string;
    profile_picture: string | null; 
  };
  content: string;
  meal_id: number | null;
  workout_id: number | null;
  like_count: number;
  liked: boolean;
  created_at: string;
}

interface FeedScreenProps {
  posts: PostType[];
}

const FeedScreen: React.FC<FeedScreenProps> = ({ posts }) => {
  const baseURL = 'http://' + process.env.EXPO_PUBLIC_API_URL + ':8000';

  if (!posts || posts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noPostsText}>No posts available.</Text>
      </View>
    );
  }

  const renderPost = ({ item }: { item: PostType }) => {
    return (
      <Post
        postId={item.post_id}
        user={item.user}
        content={item.content}
        mealId={item.meal_id}
        workoutId={item.workout_id}
        like_count={item.like_count}
        liked={item.liked}
        created_at={item.created_at}
      />
    );
  };
  
  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => item.post_id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1f26',
  },
  noPostsText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  listContainer: {
    padding: 10,
  },
});

export default FeedScreen;

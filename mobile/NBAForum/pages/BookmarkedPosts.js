import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Context } from "../globalContext/globalContext.js";
import axios from "axios";
import Post from "./Post.js";

const BookmarkedPosts = () => {
  const { baseURL } = useContext(Context);
  const [postIds, setPostIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      try {
        const response = await axios.get(`${baseURL}/get_bookmarked_post_ids/`);
        const postIds = response.data.posts.map((post) => post.post_id);
        setPostIds(postIds);

        const postRequests = postIds.map((postId) =>
          axios.get(`${baseURL}/post_detail/${postId}/`)
        );
        const postResponses = await Promise.all(postRequests);
        const fetchedPosts = postResponses.map((response) => response.data);
        setPosts(fetchedPosts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching bookmarked posts:", error);
        setIsLoading(false);
      }
    };
    fetchBookmarkedPosts();
  }, []);

  return (
    <View style={styles.container}>
      {!isLoading ? (
        <FlatList
          data={posts}
          renderItem={({ item }) => <Post post={item} />}
          keyExtractor={(item) => item.post_id.toString()}
        />
      ) : (
        <ActivityIndicator size="large" color="#ffff" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#55A1E6",
  },
});

export default BookmarkedPosts;
import React, { useContext, useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Context } from "../globalContext/globalContext.js";
import axios from "axios";
import Post from "./Post.js";

const Feed = ( {navigation} ) => {
  const { baseURL } = useContext(Context);
  const [postIds, setPostIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchFollowedProfilesPosts();
  }, []));
  
    const fetchFollowedProfilesPosts = async () => {
      try {
        const response = await axios.get(`${baseURL}/feed/`);
        const postIds = response.data.post_ids;
        setPostIds(postIds);

        const postRequests = postIds.map((postId) =>
          axios.get(`${baseURL}/post_detail/${postId}/`)
        );
        const postResponses = await Promise.all(postRequests);
        const fetchedPosts = postResponses.map((response) => response.data);
        setPosts(fetchedPosts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching followed profiles posts:", error);
        setIsLoading(false);
      }
    };
   

  return (
    <View style={styles.container}>
      {!isLoading ? (
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <Post
            post={item}
            navigation={navigation}
          />
        )}
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

export default Feed;
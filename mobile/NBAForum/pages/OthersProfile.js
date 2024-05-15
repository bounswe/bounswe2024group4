import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { Context } from "../globalContext/globalContext.js";

const OthersProfile = ({ route, navigation }) => {
  const { username } = route.params;
  const { baseURL } = useContext(Context);
  const [profileInfo, setProfileInfo] = useState({
    username: "",
    profile_picture: "https://cdn.nba.com/manage/2020/10/NBA20Primary20Logo-1-259x588.jpg",
    bio: "",
    followers_count: 0,
    following_count: 0,
    posts: [],
    isFollowing: false
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${baseURL}/profile_view_edit_others/${username}`);
        if (response.status === 200) {
          setProfileInfo({
            username: response.data.username,
            profile_picture: response.data.profile_picture || profileInfo.profile_picture,
            bio: response.data.bio,
            followers_count: response.data.followers_count,
            following_count: response.data.following_count,
            posts: response.data.posts,
            isFollowing: response.data.is_following
          });
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        Alert.alert('Error', 'Failed to fetch user profile data');
      }
    };

    fetchUserProfile();
  }, []);

  const handleFollowToggle = async () => {
    try {
      const endpoint = profileInfo.isFollowing ? '/unfollow_user/' : '/follow_user/';
      const response = await axios.post(`${baseURL}${endpoint}${username}`);
      if (response.status === 200) {
        setProfileInfo(prevState => ({
          ...prevState,
          isFollowing: !prevState.isFollowing,
          followers_count: prevState.followers_count + (prevState.isFollowing ? -1 : 1)
        }));
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
      Alert.alert('Error', 'Failed to update follow status');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.profileImageContainer}>
        <Image source={{ uri: profileInfo.profile_picture }} style={styles.profileImage} />
      </View>
      <Text style={styles.heading}>{profileInfo.username}</Text>
      <Text style={styles.bioText}>{profileInfo.bio}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statTitle}>Posts</Text>
          <Text style={styles.statValue}>{profileInfo.posts.length}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statTitle}>Followers</Text>
          <Text style={styles.statValue}>{profileInfo.followers_count}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statTitle}>Following</Text>
          <Text style={styles.statValue}>{profileInfo.following_count}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.followButton} onPress={handleFollowToggle}>
        <Text style={styles.buttonText}>{profileInfo.isFollowing ? 'Unfollow' : 'Follow'}</Text>
      </TouchableOpacity>

    
      {profileInfo.posts.map((post) => (
        <View key={post.post_id} style={styles.postContainer}>
          <Text>{post.content}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F9FF'
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  bioText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20
  },
  statItem: {
    alignItems: 'center'
  },
  statTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray'
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  followButton: {
    backgroundColor: "#1B64EB",
    padding: 10,
    borderRadius: 16,
    marginTop: 10,
    alignSelf: "center",
    width: "90%",
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  postContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 10,
    width: '100%',
    borderRadius: 5
  }
});

export default OthersProfile;

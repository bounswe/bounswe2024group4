import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Context } from "../globalContext/globalContext.js";

const Others_Profile = () => {
  
  const { baseURL } = useContext(Context);
  const [profileInfo, setProfileInfo] = useState({
    username: "",
    profile_picture: "https://cdn.nba.com/manage/2020/10/NBA20Primary20Logo-1-259x588.jpg",
    bio: "",
    followers_count: 0,
    following_count: 0,
    postsCount: 0,
    is_following: true
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${baseURL}/profile_view_edit_others`);
        console.log(response.data);
        if (response.status === 200) {
          setProfileInfo({
            username: response.data.username,
            profile_picture: response.data.profile_picture,
            bio: response.data.bio,
            followers_count: response.data.followers_count,
            following_count: response.data.following_count,
            postsCount: response.data.posts.length,
            posts: response.data.posts,
          });
          console.log("User profile data:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);  

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
          <Text style={styles.statValue}>{profileInfo.postsCount}</Text>
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

      <TouchableOpacity style={styles.followButton} onPress={() => {/* Follow/Unfollow logic */}}>
        <Text style={styles.buttonText}>{profileInfo.isFollowing ? 'Unfollow' : 'Follow'}</Text>
      </TouchableOpacity>
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
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 20
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
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
    fontSize: 18,
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
  }
});
export default Others_Profile;

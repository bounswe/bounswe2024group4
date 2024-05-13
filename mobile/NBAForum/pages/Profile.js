import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Context } from "../globalContext/globalContext.js";
import axios from 'axios';

const Profile = ({ navigation }) => {
  const globalContext = useContext(Context)
  const userObj = globalContext.userObj;
  console.log("user object:", userObj)
  const { baseURL,currentUser } = useContext(Context); 
  const [userInfo, setUserInfo] = useState({
    username: "",
    profile_picture: "https://cdn.nba.com/manage/2020/10/NBA20Primary20Logo-1-259x588.jpg",
    bio: "",
    followers_count: 0,
    following_count: 0,
    postsCount: 0,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${baseURL}/profile_view_edit/${currentUser.user_id}`);
        if (response.status === 200) {
          setUserInfo({
            username: response.data.username,
            profile_picture: response.data.profile_picture || userInfo.profile_picture,
            bio: response.data.bio,
            followers_count: response.data.followers_count,
            following_count: response.data.following_count,
            postsCount: response.data.posts.length,
          });
          console.log("User profile data:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, [baseURL]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.profileImageContainer}>
        <View style={styles.profileImageWrapper}>
          <Image source={{ uri: userInfo.profile_picture }} style={styles.profileImage} />
        </View>
      </View>
      <Text style={styles.heading}>{userInfo.username}</Text>
      <Text style={styles.bioText}>{userInfo.bio}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statTitle}>Posts</Text>
          <Text style={styles.statValue}>{userInfo.postsCount}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statTitle}>Followers</Text>
          <Text style={styles.statValue}>{userInfo.followers_count}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statTitle}>Following</Text>
          <Text style={styles.statValue}>{userInfo.following_count}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditProfile')}>
        <Text style={styles.buttonText}>Edit Profile</Text>
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
    alignItems: 'center',  
    marginBottom: 20,
  },
  profileImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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
  button: {
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
  },
  postItem: {
    fontSize: 16,
    marginBottom: 10
  }
});

export default Profile;
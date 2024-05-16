import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Post from './Post.js';
import { Context } from "../globalContext/globalContext.js";
import AsyncStorage from '@react-native-async-storage/async-storage'

const OthersProfile = ({ route, navigation }) => {
  const { username } = route.params;
  const { baseURL } = useContext(Context);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isFollowing, setIsFollowing ] = useState(false);
  const [ followerCount, setFollowerCount ] = useState(0);
  const [ ownProfile, setOwnProfile ] = useState(false);
  const [ profileInfo, setProfileInfo ] = useState({
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
        const thisUsername = await AsyncStorage.getItem('username');
        console.log('uuuuu', thisUsername);
        setOwnProfile(thisUsername === username);
        console.log(ownProfile)
        if (response.status === 200) {
          const userProfileData = response.data;
          const postIds = userProfileData.posts;
          // Fetch post details for each post
          const postRequests = postIds.map(postId => axios.get(`${baseURL}/post_detail/${postId.post_id}/`));
          const postResponses = await Promise.all(postRequests);
          const fetchedPosts = postResponses.map(response => response.data);
          setProfileInfo({
            username: userProfileData.username,
            profile_picture: userProfileData.profile_picture || profileInfo.profile_picture,
            bio: userProfileData.bio,
            followers_count: userProfileData.followers_count,
            following_count: userProfileData.following_count,
            posts: fetchedPosts, // Set fetched posts here
            isFollowing: userProfileData.is_following
          });
          setIsLoading(false);
          setIsFollowing(userProfileData.is_following);
          setFollowerCount(userProfileData.followers_count);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        Alert.alert('Error', 'Failed to fetch user profile data');
        setIsLoading(false);
      }
    };
  
    fetchUserProfile();
  }, []);

  const handleFollow = async () => {
    const prevFollowerCount = profileInfo.followers_count;
    
    
    try {
      const csrfToken = (await axios.get(baseURL + "/csrf_token/")).data
        .csrf_token;
      const endpoint = isFollowing ? '/unfollow_user/' : '/follow_user/';
      setFollowerCount(isFollowing ? (prev) => prev - 1 : (prev) => prev + 1);
      setIsFollowing(!isFollowing);
      console.log(baseURL + endpoint + username);
      const response = await axios.post(
        baseURL + endpoint + username,
        "",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
        }
      );
      if (response.status !== 200) {
        setIsFollowing(!isFollowing);
        setFollowerCount(prevFollowerCount);
      }
    } catch (error) {
      setIsFollowing(!isFollowing);
      setFollowerCount(prevFollowerCount);
      console.error("Error updating follow status:", error);
      Alert.alert('Error', 'Failed to update follow status');
    }
  };

  return (
    <View style={styles.scrollContainer}>
      {!isLoading ? (
        <>
        <View>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: baseURL + profileInfo.profile_picture }} style={styles.profileImage} />
            <View style={styles.scrollContainer}>
              <Text style={styles.heading}>{profileInfo.username}</Text>
              <Text style={styles.bioText}>{profileInfo.bio}</Text>
              {!ownProfile && 
              <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
                <Text style={styles.buttonText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
              </TouchableOpacity>
              }
            </View> 
          </View>
        
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statTitle}>Posts</Text>
              <Text style={styles.statValue}>{profileInfo.posts.length}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statTitle}>Followers</Text>
              <Text style={styles.statValue}>{followerCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statTitle}>Following</Text>
              <Text style={styles.statValue}>{profileInfo.following_count}</Text>
            </View>
          </View>
  
          <FlatList
            data={profileInfo.posts}
            renderItem={({ item }) => (
              <Post
                post={item}
                navigation={navigation}
              />
            )}
            keyExtractor={(item) => item.post_id.toString()}
          />
        </View>
        </>
      ) : (
        <ActivityIndicator size="large" color="#00" />
      )}
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    alignSelf: 'flex-start'
  },
  bioText: {
    fontSize: 16,
    alignSelf: 'flex-start',
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
    alignSelf: "flex-start",
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default OthersProfile;

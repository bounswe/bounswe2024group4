import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { Rating } from 'react-native-ratings';
import axios from 'axios';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import PostsScreen from './index';
import WorkoutsScreen from '../../components/WorkoutsScreen';
import MealsScreen from '../../components/MealsScreen';

interface Route {
  key: 'posts' | 'workouts' | 'meals';
  title: string;
}

function ProfileScreen() {
  const router = useRouter();
  const { viewingUser, viewedUser } = useGlobalSearchParams();
  const [index, setIndex] = useState(0);
  const [routes] = useState<Route[]>([
    { key: 'posts', title: 'Posts' },
    { key: 'workouts', title: 'Workouts' },
    { key: 'meals', title: 'Meals' },
  ]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const baseURL = 'http://' + process.env.EXPO_PUBLIC_API_URL + ':8000';
  const isOwnProfile = viewingUser === viewedUser;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileResponse = await axios.get(
          `${baseURL}/view_profile/?viewing_username=${viewingUser}&viewed_username=${viewedUser}`
        );
        console.log('log',profileResponse.data)
        setUserData(profileResponse.data);
        setIsFollowing(profileResponse.data.is_following);

        const programsResponse = await axios.get(`${baseURL}/get-workouts/?username=${viewedUser}`);
        setPrograms(programsResponse.data);
      } catch (error) {
        console.error('Error fetching profile or workouts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [viewingUser, viewedUser]);

  const handleFollowToggle = async () => {
    try {
      const action = isFollowing ? 'unfollow' : 'follow';
      await axios.post(`${baseURL}/${action}/`, {
        viewing_username: viewingUser,
        viewed_username: viewedUser,
      });
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow state:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#FFFFFF' }}>Failed to load profile.</Text>
      </View>
    );
  }

  const {
    bio,
    profile_picture,
    score,
    followers_count,
    following_count,
    posts,
    height,
    weight_history,
  } = userData;

  const profilePictureUri = profile_picture?.trim() !== '' ? profile_picture : 'https://via.placeholder.com/150';
  const recentWeight = weight_history?.length > 0 ? weight_history[weight_history.length - 1] : null;

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'workouts':
        return <WorkoutsScreen workoutPrograms={programs} isOwnProfile={isOwnProfile} />;
      case 'posts':
        return <PostsScreen />;
      case 'meals':
        return <MealsScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image source={{ uri: profilePictureUri }} style={styles.profilePicture} />
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={[styles.statLabel, styles.boldText]}>Score</Text>
            <View style={styles.ratingContainer}>
              <Rating type="star" startingValue={score} readonly imageSize={18} tintColor="#1B55AC" />
              <Text style={styles.ratingText}>{score.toFixed(1)} / 5</Text>
            </View>
          </View>
          <View style={styles.rowStats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{followers_count}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{following_count}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.userBioContainer}>
        <Text style={styles.userName}>{viewedUser}</Text>
        <Text style={styles.userBio}>{bio}</Text>
        <View style={styles.additionalInfo}>
          <Text style={styles.additionalInfoText}>Height: {height} cm</Text>
          <Text style={styles.additionalInfoText}>
            Recent Weight: {recentWeight ? `${recentWeight.weight} kg` : 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtonContainer}>
        {isOwnProfile ? (
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() =>
              router.push({
                pathname: '/EditProfileScreen',
                params: { username: viewedUser, bio, profilePicture: profile_picture, height, recentWeight },
              })
            }
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.followButton, isFollowing ? styles.unfollowButton : {}]}
            onPress={handleFollowToggle}
          >
            <Text style={styles.buttonText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B55AC',
  },
  userInfo: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1B55AC',
    alignItems: 'center',
  },
  profilePicture: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#609FFF',
    overflow: 'hidden',
    marginRight: 40,
  },
  statsContainer: {
    flex: 1,
  },
  rowStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 13,
    color: '#dcdcdc',
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  userBioContainer: {
    padding: 16,
    backgroundColor: '#1B55AC',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userBio: {
    fontSize: 14,
    color: '#dcdcdc',
    marginTop: 10,
  },
  additionalInfo: {
    marginTop: 10,
  },
  additionalInfoText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  actionButtonContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  editProfileButton: {
    backgroundColor: '#609FFF',
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 25,
  },
  followButton: {
    backgroundColor: '#609FFF',
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 25,
  },
  unfollowButton: {
    backgroundColor: '#FF0000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabBar: {
    backgroundColor: '#1B55AC',
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  indicator: {
    backgroundColor: '#FFA726',
    height: 3,
  },
});

export default ProfileScreen;

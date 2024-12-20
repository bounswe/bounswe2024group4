import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { Rating } from 'react-native-ratings';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import WorkoutsScreen from '../components/WorkoutsScreen';
import FeedScreen from '../components/FeedScreen';
import MealsScreen from '../components/MealsScreen';

interface Route {
  key: 'posts' | 'workouts' | 'meals';
  title: string;
}

function ProfileDetailScreen() {
  const { viewedUser, viewingUser, isEditing } = useGlobalSearchParams();
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
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const baseURL = 'http://' + process.env.EXPO_PUBLIC_API_URL + ':8000';

  useEffect(() => {
    if (viewedUser === viewingUser && !isEditing) {
      router.replace('/profile');
    }
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const config = {
          headers: {
            Authorization: 'Token ' + token,
          },
        };

        const profileResponse = await axios.get(
          `${baseURL}/view_profile/?viewed_username=${viewedUser}`,
          config
        );
        const data = profileResponse.data;
        setUserData(data);
        const enrichedPosts = data.posts.map((post: any) => ({
          ...post,
          user: {
            username: data.username,
            profile_picture: data.profile_picture,
          },
        }));

        setUserData({
          ...data,
          posts: enrichedPosts,
        });
        setIsFollowing(data.is_following);
        console.log(profileResponse.data.posts)

        const workoutDetailsPromises = data.workouts.map(async (workout: any) => {
          const response = await axios.get(`${baseURL}/get-workout/${workout.workout_id}/`, config);
          return response.data;
        });

        const detailedWorkouts = await Promise.all(workoutDetailsPromises);
        setPrograms(detailedWorkouts);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [viewedUser, viewingUser, isEditing]);

  const handleFollowToggle = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const config = {
        headers: {
          Authorization: 'Token ' + token,
        },
      };

      const action = isFollowing ? 'unfollow' : 'follow';
      await axios.post(
        `${baseURL}/${action}/`,
        {
          follower: await AsyncStorage.getItem('username'),
          following: viewedUser,
        },
        config
      );
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

  const profilePictureUri =
    profile_picture && profile_picture.trim() !== ""
      ? `${baseURL}/${profile_picture}` 
      : "https://via.placeholder.com/150";
  const recentWeight = weight_history?.length > 0 ? weight_history[weight_history.length - 1] : null;

  const labels = weight_history?.length > 0
    ? weight_history.map((item: any) => new Date(item.date).toLocaleDateString())
    : [];
  const weights = weight_history?.length > 0
    ? weight_history.map((item: any) => item.weight)
    : [];

    const renderScene = ({ route }: { route: Route }) => {
      switch (route.key) {
        case 'workouts':
          return <WorkoutsScreen workoutPrograms={programs} isOwnProfile={false} />;
          case 'posts':
            return <FeedScreen posts={posts} />; 
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
              <Rating
                type="star"
                startingValue={score}
                readonly
                imageSize={18}
                tintColor="#1B55AC"
              />
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
        <Text style={styles.userBio}>{bio || 'No bio available.'}</Text>
        <View style={styles.additionalInfo}>
          <Text style={styles.additionalInfoText}>Height: {height} cm</Text>
          <View style={styles.weightContainer}>
            <Text style={styles.additionalInfoText}>
              Recent Weight: {recentWeight ? `${recentWeight.weight} kg` : 'N/A'}
            </Text>
            {weight_history?.length > 0 && (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.moreText}>View More...</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          style={[styles.followButton, isFollowing ? styles.unfollowButton : {}]}
          onPress={handleFollowToggle}
        >
          <Text style={styles.buttonText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
        </TouchableOpacity>
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

      {/* Modal for Weight History */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Weight History</Text>
            {weight_history?.length > 0 ? (
              <LineChart
                data={{
                  labels: labels,
                  datasets: [
                    {
                      data: weights,
                    },
                  ],
                }}
                width={Dimensions.get('window').width - 40}
                height={220}
                yAxisSuffix="kg"
                chartConfig={{
                  backgroundColor: '#1B55AC',
                  backgroundGradientFrom: '#1B55AC',
                  backgroundGradientTo: '#609FFF',
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#FFA726',
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            ) : (
              <Text style={styles.noDataText}>No weight history available</Text>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreText: {
    color: '#609FFF',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  noDataText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
    fontWeight: 'bold',
  },
  actionButtonContainer: {
    marginVertical: 16,
    alignItems: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B55AC',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#609FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileDetailScreen;

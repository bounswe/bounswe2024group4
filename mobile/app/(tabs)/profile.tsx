import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { Rating } from 'react-native-ratings';
import PostsScreen from './index';
import WorkoutsScreen from '../../components/WorkoutsScreen';
import MealsScreen from '../../components/MealsScreen';
import { useRouter } from 'expo-router';
import axios from 'axios';

// Define route type
interface Route {
  key: 'posts' | 'workouts' | 'meals';
  title: string;
}

// Define renderScene mapping
const renderScene: Record<Route['key'], React.ComponentType> = {
  posts: PostsScreen,
  workouts: WorkoutsScreen,
  meals: MealsScreen,
};

// Mock user data structure based on your backend
const mockUser = {
  username: 'John Doe',
  bio: 'Fitness enthusiast, meal prep lover, and personal trainer. Let’s stay active!',
  profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/%E9%98%BF%E7%88%BE%E9%81%94%C2%B7%E5%B1%85%E5%8B%92%E7%88%BE2024%E6%AD%90%E6%B4%B2%E7%9B%83%E9%A6%96%E5%A0%B4%E5%B0%8F%E7%B5%84%E8%B3%BD%E9%A6%96%E7%99%BC-2024.jpg/400px-%E9%98%BF%E7%88%BE%E9%81%94%C2%B7%E5%B1%85%E5%8B%92%E7%88%BE2024%E6%AD%90%E6%B4%B2%E7%9B%83%E9%A6%96%E5%A0%B4%E5%B0%8F%E7%B5%84%E8%B3%BD%E9%A6%96%E7%99%BC-2024.jpg',
  score: 4.2, 
  height: 175, 
  weightHistory: [
    { weight: 70, date: '2024-01-01' }, 
    { weight: 72, date: '2024-02-01' },
    { weight: 68, date: '2024-03-01' },
  ],
  followers: 1200,
  following: 300,
  posts: 45,
};

interface ProfileScreenProps {
  isOwnProfile?: boolean; // Optional prop with default value
}

function ProfileScreen({ isOwnProfile = true }: ProfileScreenProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [routes] = useState<Route[]>([
    { key: 'posts', title: 'Posts' },
    { key: 'workouts', title: 'Workouts' },
    { key: 'meals', title: 'Meals' },
  ]);

  const [isFollowing, setIsFollowing] = useState(false); // State for follow/unfollow

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing); // Toggle follow/unfollow state
  };

  // Extract the most recent weight
  const recentWeight =
    mockUser.weightHistory.length > 0
      ? mockUser.weightHistory[mockUser.weightHistory.length - 1].weight
      : null;

  return (
    <View style={styles.container}>
      {/* User Info Section */}
      <View style={styles.userInfo}>
        <Image source={{ uri: mockUser.profilePicture }} style={styles.profilePicture} />
        <View style={styles.statsContainer}>
          {/* Score Section */}
          <View style={styles.stat}>
          <Text style={[styles.statLabel, styles.boldText]}>Score</Text>
            <View style={styles.ratingContainer}>
              <Rating
                type="star"
                startingValue={mockUser.score}
                readonly
                imageSize={18}
                tintColor="#1B55AC"
              />
              <Text style={styles.ratingText}>{mockUser.score} / 5</Text>
            </View>
          </View>
          {/* Stats Section */}
          <View style={styles.rowStats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{mockUser.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{mockUser.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{mockUser.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
      </View>

      {/* User Bio Section */}
      <View style={styles.userBioContainer}>
        <Text style={styles.userName}>{mockUser.username}</Text>
        <Text style={styles.userBio}>{mockUser.bio}</Text>
        {/* Height & Weight Section */}
        <View style={styles.heightWeightContainer}>
          <Text style={styles.heightWeightText}>Height: {mockUser.height} cm</Text>
          {recentWeight && <Text style={styles.heightWeightText}>Weight: {recentWeight} kg</Text>}
        </View>
      </View>

      {/* Action Button */}
      <View style={styles.actionButtonContainer}>
        {isOwnProfile ? (
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => router.push('/EditProfileScreen')} // Route change
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.followButton, isFollowing ? styles.unfollowButton : {}]}
            onPress={handleFollowToggle}
          >
            <Text style={styles.buttonText}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tab View Section */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={({ route }) => {
          const SceneComponent = renderScene[route.key];
          return <SceneComponent />;
        }}
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
    color:'#fff',
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
    marginTop: -20,
    color: '#fff',
  },
  userBio: {
    fontSize: 14,
    color: '#dcdcdc',
    marginTop: 10,
  },
  heightWeightContainer: {
    marginTop: 10,
  },
  heightWeightText: {
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
    marginTop: -15,
  },
  followButton: {
    backgroundColor: '#609FFF',
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 25,
  },
  unfollowButton: {
    backgroundColor: '#609FFF',
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

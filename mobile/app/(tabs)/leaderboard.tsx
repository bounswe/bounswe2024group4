import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';

interface LeaderboardEntry {
  username: string;
  profile_picture: string | null;
  rating?: number;
  workout_rating?: number;
  meal_rating?: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'combined' | 'workout' | 'meal'>('combined'); // Default tab

  const fetchLeaderboard = async (endpoint: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(endpoint);
      if (response.status === 200) {
        const dataKey =
          activeTab === 'combined'
            ? 'leaderboard'
            : activeTab === 'workout'
            ? 'workout_leaderboard'
            : 'meal_leaderboard';
        setLeaderboardData(response.data[dataKey]);
      } else {
        setError('Failed to fetch leaderboard data.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const endpoints = {
      combined: 'http://127.0.0.1:8000/get_leaderboard/', //put your ip ex:http://192.100.5.5:8000/get_leaderboard/
      workout: 'http://127.0.0.1:8000/get_workout_leaderboard/', //put your ip ex:http://192.100.5.5:8000/get_workout_leaderboard/
      meal: 'http://127.0.0.1:8000/get_meal_leaderboard/', //put your ip ex:http://192.100.5.5:8000/get_meal_leaderboard/
    };
    fetchLeaderboard(endpoints[activeTab]);
  }, [activeTab]);

  const renderItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => (
    <View style={styles.entryContainer}>
      <Text style={styles.rank}>#{index + 1}</Text>
      <Image
        source={{
          uri: item.profile_picture || 'https://via.placeholder.com/50',
        }}
        style={styles.profileImage}
      />
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.score}>
        {activeTab === 'combined' && item.rating?.toFixed(1)}
        {activeTab === 'workout' && item.workout_rating?.toFixed(1)}
        {activeTab === 'meal' && item.meal_rating?.toFixed(1)}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading Leaderboard...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'combined' && styles.activeTab]}
          onPress={() => setActiveTab('combined')}
        >
          <Text style={styles.tabText}>Combined</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'workout' && styles.activeTab]}
          onPress={() => setActiveTab('workout')}
        >
          <Text style={styles.tabText}>Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'meal' && styles.activeTab]}
          onPress={() => setActiveTab('meal')}
        >
          <Text style={styles.tabText}>Meal</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={leaderboardData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  title: {
    fontSize: 28,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#333333',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#FFD700',
    fontSize: 18,
    textAlign: 'center',
  },
  entryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  rank: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  username: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  score: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Leaderboard;

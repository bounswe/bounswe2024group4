import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  View,
  Image,
} from 'react-native';
import axios from 'axios';

interface LeaderboardEntry {
  username: string;
  profile_picture: string | null;
  rating: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://127.0.0.1:8000/get_leaderboard/');
        if (response.status === 200) {
          setLeaderboardData(response.data.leaderboard);
        } else {
          setError('Failed to fetch leaderboard data.');
        }
      } catch (err) {
        setError('Something went wrong. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

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
      <Text style={styles.score}>{item.rating.toFixed(1)}</Text>
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
      <Text style={styles.title}>🏆 Leaderboard</Text>
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

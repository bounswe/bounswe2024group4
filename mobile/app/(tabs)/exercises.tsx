import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WorkoutProgram from '../../components/WorkoutProgram';
import axios from 'axios';

const baseURL = 'http://' + process.env.EXPO_PUBLIC_API_URL + ':8000'
const username = 'user1'; // Replace with the appropriate username logic

export default function Index() {
  const [workoutPrograms, setWorkoutPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkoutPrograms = async () => {
    try {
      const response = await axios.get(`${baseURL}/get-workouts/?username=${username}`);
      setWorkoutPrograms(response.data);
    } catch (error) {
      console.error('Error fetching workout programs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutPrograms();
  }, []);

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem('existingExercises');
      console.log('AsyncStorage cleared!');
    } catch (error) {
      console.error('Failed to clear AsyncStorage:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <ActivityIndicator size="large" color="#1B55AC" style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={workoutPrograms}
        renderItem={({ item }) => <WorkoutProgram workout={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.programList}
      />
      <Link href="../muscleGroupSelector" asChild>
        <TouchableOpacity onPress={clearAsyncStorage} style={styles.addButton}>
          <FontAwesome5 name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1b1d21',
  },
  programList: {
    padding: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: '#1B55AC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

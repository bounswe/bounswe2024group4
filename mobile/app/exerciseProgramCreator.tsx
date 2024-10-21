import { SafeAreaView, StyleSheet, TouchableOpacity, Text } from "react-native";
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Link } from "expo-router";
import WorkoutProgram from '../components/WorkoutProgram';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import images from '../constants/image_map';

export default function ExerciseCreate() {
  const { selectedExercises, muscleName } = useLocalSearchParams<{
    selectedExercises: string;
    muscleName: string;
  }>();

  const [workoutProgram, setWorkoutProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exercisesArray = selectedExercises ? selectedExercises.split(',') : [];
        const existingExercisesString = await AsyncStorage.getItem('existingExercises');
        const existingExercisesArray = existingExercisesString ? JSON.parse(existingExercisesString) : [];
        
        const newExercises = exercisesArray.map((name, index) => ({
          id: String(existingExercisesArray.length + index + 1),
          image: images[muscleName],
          name,
          sets: 0,
          reps: 0,
        }));
        
        const combinedExercisesArray = Array.from(new Set([...existingExercisesArray, ...newExercises]));
        
        const newWorkoutProgram = {
          id: '1',
          name: 'Draft',
          exercises: combinedExercisesArray,
        };
        
        await AsyncStorage.setItem('existingExercises', JSON.stringify(combinedExercisesArray));        
        setWorkoutProgram(newWorkoutProgram);
      } catch (error) {
        console.error('Error loading exercises: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [selectedExercises, muscleName]);

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!workoutProgram) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.loadingText}>No workout program found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <SafeAreaView style={styles.background}>
        {workoutProgram && <WorkoutProgram workout={workoutProgram} />}
        <Link href="../muscleGroupSelector" asChild>
          <TouchableOpacity onPress={() => {  }} style={styles.addButton}>
            <FontAwesome5 name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </Link>
        <Link href={{pathname: "../exercises"}} asChild>
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={() => {}}
          >
            <Text style={styles.proceedButtonText}>Save</Text>
          </TouchableOpacity>
        </Link>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#1b1d21",
    padding: 10
  },
  screen: {
    flex: 1,
    backgroundColor: "#1b1d21",
  },
  loadingText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    position: 'relative',
    top: 10,
    left: 175,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: '#1B55AC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButton: {
    position: 'absolute',
    bottom: 20,
    left: 280,
    width: 75,
    backgroundColor: '#1B55AC',
    borderRadius: 10,
    padding: 20,
  },
  proceedButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'justify',
  },
});

import { Text, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from 'react';
import { Stack, useLocalSearchParams, useGlobalSearchParams, useRouter } from "expo-router";
import axios from 'axios';
import { Exercise } from '../constants/types';

export default function ExerciseSelect() {
  const baseURL = 'http://' + process.env.EXPO_PUBLIC_API_URL + ':8000';
  const { muscleName } = useLocalSearchParams<{
    muscleName: string;
  }>();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const { viewingUser, viewedUser } = useGlobalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(`${baseURL}/get_exercises/?muscle=${muscleName}`, {});
        setExercises(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExercises();
  }, [muscleName]);

  const handleSelectExercise = (exercise: Exercise) => {
    const isAlreadySelected = selectedExercises.some(selected => selected.name === exercise.name);

    if (isAlreadySelected) {
      setSelectedExercises(selectedExercises.filter(selected => selected.name !== exercise.name));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const handleAddButtonPress = () => {
    router.push({
      pathname: "../exerciseProgramCreator",
      params: {
        selectedExercises: JSON.stringify(selectedExercises),
        muscleName,
        viewingUser,
        viewedUser,
      },
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.background}>
        <Text style={styles.headerText}>{muscleName.replace(/_/g, ' ')} exercises</Text>
        {exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.name}
            style={[styles.exerciseItem, selectedExercises.some(selected => selected.name === exercise.name) && styles.selected]}
            onPress={() => handleSelectExercise(exercise)}
          >
            <Text style={styles.exerciseText}>{exercise.name}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={handleAddButtonPress}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#1b1d21"
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    marginBottom: 15,
    marginLeft: 35
  },
  screen: {
    flex: 1,
    backgroundColor: "#1b1d21",
  },
  exerciseItem: {
    fontSize: 18,
    color: 'white',
    marginLeft: 35,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#16181A',
  },
  exerciseText: {
    fontSize: 18,
    color: 'white',
  },
  selected: {
    backgroundColor: '#1B55AC',
  },
  addButton: {
    position: 'relative',
    top: 20,
    left: 260,
    width: 75,
    backgroundColor: '#1B55AC',
    borderRadius: 10,
    padding: 10,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  }
});

import { Text, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from 'react';
import { Stack, useLocalSearchParams } from "expo-router";
import { Link } from 'expo-router';
import axios from 'axios';

export default function ExerciseSelect() {
  const baseURL = 'http://' + process.env.EXPO_PUBLIC_API_URL + ':8000'
  const { muscleName } = useLocalSearchParams<{
    muscleName: string;
  }>();
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);

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

  const handleSelectExercise = (exerciseName) => {
    const isAlreadySelected = selectedExercises.some(selected => selected === exerciseName);
  
    if (isAlreadySelected) {
      setSelectedExercises(selectedExercises.filter(selected => selected !== exerciseName));
    } else {
      setSelectedExercises([...selectedExercises, exerciseName]);
    }
  };
  
  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.background}>
        <Text style={styles.headerText}> {muscleName.replace(/_/g, ' ')} exercises </Text>
        {exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.name}
            style={[styles.exerciseItem, selectedExercises.some(selected => selected === exercise.name) && styles.selected]}
            onPress={() => handleSelectExercise(exercise.name)}
          >
            <Text style={styles.exerciseText}>{exercise.name}</Text>
          </TouchableOpacity>
        ))}
        <Link href={{pathname: "../exerciseProgramCreator", params: {selectedExercises: selectedExercises, muscleName: muscleName}}} asChild>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {}}
          >
            <Text style={styles.addButtonText}>Add</Text>
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
    alignItems: "start",
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
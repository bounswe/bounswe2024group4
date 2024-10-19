import { Text, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from "expo-router";
import { Link } from 'expo-router';
import axios from 'axios';

export default function ExerciseSelect() {
  const params = useLocalSearchParams();
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);

  // TODO: Fix this by using backend's endpoint
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(`https://api.api-ninjas.com/v1/exercises?muscle=${params.exerciseName}`, {
          headers: {
            'X-API-KEY': ''
          }
        });
        setExercises(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExercises();
  }, [params.exerciseName]);

  const handleSelectExercise = (exercise) => {
    const isAlreadySelected = selectedExercises.some(selected => selected.name === exercise.name);
  
    if (isAlreadySelected) {
      setSelectedExercises(selectedExercises.filter(selected => selected.name !== exercise.name));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };
  
  return (
    <SafeAreaView style={styles.screen}>
      <SafeAreaView style={styles.background}>
        <Text style={styles.headerText}> {params.exerciseName} exercises </Text>
        {exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.name}
            style={[styles.exerciseItem, selectedExercises.some(selected => selected.name === exercise.name) && styles.selected]}
            onPress={() => handleSelectExercise(exercise)}
          >
            <Text style={styles.exerciseText}>{exercise.name}</Text>
          </TouchableOpacity>
        ))}
        <Link href={{pathname: "../exerciseProgramCreator", params: {selectedExercises: selectedExercises}}} asChild>
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
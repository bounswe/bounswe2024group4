import { Text, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from "expo-router";
import WorkoutProgram from '../components/WorkoutProgram';

export default function ExerciseCreate() {
  const params = useLocalSearchParams();
  const workoutProgram = {
    id: '1',
    name: 'a',
    exercises: [
      {
        id: '1',
        image: require('../assets/images/biceps.png'),
        name: 'Pull Ups',
        sets: 4,
        reps: 8,
      },
      {
        id: '2',
        image: require('../assets/images/back.png'),
        name: 'Deadlift',
        sets: 3,
        reps: 6,
      },
    ],
  }
  
  return (
    <SafeAreaView style={styles.screen}>
      <SafeAreaView style={styles.background}>
        <WorkoutProgram workout={workoutProgram} />
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
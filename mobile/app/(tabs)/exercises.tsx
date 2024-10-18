import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import WorkoutProgram from '../../components/WorkoutProgram';

const workoutPrograms = [
  {
    id: '1',
    name: 'Chest and Triceps',
    rating: '4.5',
    exercises: [
      {
        id: '1',
        image: require('../../assets/images/gym.png'),
        name: 'Bench Press',
        sets: 4,
        reps: 10,
      },
      {
        id: '2',
        image: require('../../assets/images/shoulder.png'),
        name: 'Dumbbell Flyes',
        sets: 3,
        reps: 12,
      },
    ],
  },
  {
    id: '2',
    name: 'Back and Biceps',
    rating: '4.8',  // Hardcoded rating
    exercises: [
      {
        id: '1',
        image: require('../../assets/images/biceps.png'),
        name: 'Pull Ups',
        sets: 4,
        reps: 8,
      },
      {
        id: '2',
        image: require('../../assets/images/back.png'),
        name: 'Deadlift',
        sets: 3,
        reps: 6,
      },
    ],
  },
];

export default function Index() {
  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={workoutPrograms}
        renderItem={({ item }) => <WorkoutProgram workout={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.programList}
      />
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
});

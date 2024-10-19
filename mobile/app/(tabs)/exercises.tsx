import React from 'react';
import { FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import WorkoutProgram from '../../components/WorkoutProgram';

const workoutPrograms = [
  {
    id: '1',
    name: 'Chest and Triceps',
    rating: '4.5',
    exercises: [
      {
        id: '1',
        image: require('../../assets/images/chest.png'),
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
      <Link href="../muscleGroupSelector" asChild>
        <TouchableOpacity onPress={() => {  }} style={styles.addButton}>
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
});

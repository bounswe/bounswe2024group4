import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WorkoutProgram from '../../components/WorkoutProgram';
import axios from 'axios';
import { useRouter, useGlobalSearchParams } from 'expo-router';

const baseURL = 'http://' + process.env.EXPO_PUBLIC_API_URL + ':8000';

const allowedMuscles = [
  "chest",
  "biceps",
  "shoulders",
  "triceps",
  "middle_back",
  "lower_back",
  "traps",
  "abdominals",
  "quadriceps",
  "hamstrings",
  "glutes",
  "calves",
] as const;

function mapMuscleToEnum(muscle: string): typeof allowedMuscles[number] {
  return allowedMuscles.includes(muscle as typeof allowedMuscles[number])
    ? (muscle as typeof allowedMuscles[number])
    : "chest"; // Default to "Chest" if not in the allowed list
}

interface Exercise {
  id: string;
  image: any;
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  instructions: string;
  instruction: string;
  sets: number;
  reps: number;
}

interface WorkoutProgramType {
  id: string;
  workout_name: string;
  created_by: string;
  rating: number;
  rating_count: number;
  exercises: Exercise[];
}

export default function Index() {
  const [workoutPrograms, setWorkoutPrograms] = useState<WorkoutProgramType[]>([]);
  const [loading, setLoading] = useState(true);
  const { viewingUser, viewedUser } = useGlobalSearchParams();
  const router = useRouter();

  const fetchWorkoutPrograms = async () => {
    try {
      const response = await axios.get(`${baseURL}/get-workouts/?username=${viewingUser}`);
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
        renderItem={({ item }) => (
          <WorkoutProgram
            workout={{
              id: item.id,
              name: item.workout_name,
              created_by: item.created_by,
              rating: item.rating,
              rating_count: item.rating_count,
              exercises: item.exercises.map((exercise) => ({
                ...exercise,
                muscle: mapMuscleToEnum(exercise.muscle),
              })),
            }}
            onUpdate={(updatedWorkout) => {
              setWorkoutPrograms((prev) =>
                prev.map((workout) =>
                  workout.id === updatedWorkout.id
                    ? {
                        ...workout,
                        workout_name: updatedWorkout.name,
                        created_by: updatedWorkout.created_by,
                        rating: updatedWorkout.rating,
                        rating_count: updatedWorkout.rating_count,
                        exercises: updatedWorkout.exercises,
                      }
                    : workout
                )
              );
            }}
          />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.programList}
      />

      <TouchableOpacity
        onPress={() => {
          clearAsyncStorage();
          router.push({
            pathname: '../muscleGroupSelector',
            params: { viewingUser, viewedUser },
          });
        }}
        style={styles.addButton}
      >
        <FontAwesome5 name="plus" size={24} color="#fff" />
      </TouchableOpacity>
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

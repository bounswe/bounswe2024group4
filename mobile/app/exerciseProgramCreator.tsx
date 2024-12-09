import { SafeAreaView, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useGlobalSearchParams, Stack, useRouter } from "expo-router";
import WorkoutProgram from "../components/WorkoutProgram";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import images from "../constants/image_map";
import axios from "axios";
import { Exercise, Workout } from "../constants/types";

export default function ExerciseCreate() {
  const baseURL = "http://" + process.env.EXPO_PUBLIC_API_URL + ":8000";
  const { selectedExercises, muscleName } = useLocalSearchParams<{ selectedExercises: string; muscleName: string }>();
  const { viewingUser, viewedUser } = useGlobalSearchParams();
  const router = useRouter();

  const [workoutProgram, setWorkoutProgram] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exercisesArray: Exercise[] = selectedExercises ? JSON.parse(selectedExercises) : [];
        const existingExercisesString = await AsyncStorage.getItem("existingExercises");
        const existingExercisesArray: Exercise[] = existingExercisesString ? JSON.parse(existingExercisesString) : [];

        const newExercises = exercisesArray.map((exercise: Exercise, index) => ({
          id: String(existingExercisesArray.length + index + 1),
          image: images[muscleName],
          name: exercise.name || "",
          sets: exercise.sets || 0,
          reps: exercise.reps || 0,
          type: exercise.type || "",
          muscle: exercise.muscle || muscleName,
          equipment: exercise.equipment || "",
          instructions: exercise.instructions || "",
        }));

        const combinedExercisesArray = Array.from(new Set([...existingExercisesArray, ...newExercises]));

        const newWorkoutProgram: Workout = {
          id: "1",
          name: "Draft",
          created_by: (await AsyncStorage.getItem("username")) || "unknown",
          exercises: combinedExercisesArray as Exercise[],
          rating: 0,
          rating_count: 0,
        };

        await AsyncStorage.setItem("existingExercises", JSON.stringify(combinedExercisesArray));
        setWorkoutProgram(newWorkoutProgram);
      } catch (error) {
        console.error("Error loading exercises: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [selectedExercises, muscleName]);

  const handleSave = async () => {
    if (!workoutProgram || workoutProgram.exercises.length === 0) {
      Alert.alert("Error", "The workout program is empty. Please add exercises.");
      return;
    }

    try {
      const csrfToken = await AsyncStorage.getItem("csrfToken");

      const workoutData = workoutProgram.exercises.map((exercise: Exercise) => ({
        type: exercise.type,
        name: exercise.name,
        muscle: exercise.muscle,
        equipment: exercise.equipment,
        instruction: exercise.instructions,
        sets: exercise.sets,
        reps: exercise.reps,
      }));

      const body = {
        workout_name: workoutProgram.name,
        exercises: workoutData,
        username: await AsyncStorage.getItem("username"),
      };

      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      };

      await axios.post(`${baseURL}/workout_program/`, body, config);

      Alert.alert("Success", "Workout program saved successfully!");
      router.push({
        pathname: "../exercises",
        params: { viewingUser, viewedUser },
      });
    } catch (error) {
      console.error("Failed to save workout program:", error);
      Alert.alert("Error", "Failed to save workout program. Please try again.");
    }
  };

  const handleCancel = async () => {
    await clearAsyncStorage();
    router.push({
      pathname: "../exercises",
      params: { viewingUser, viewedUser },
    });
  };

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem("existingExercises");
      console.log("AsyncStorage cleared!");
    } catch (error) {
      console.error("Failed to clear AsyncStorage:", error);
    }
  };

  const handleWorkoutUpdate = (updatedWorkout: Workout) => {
    setWorkoutProgram(updatedWorkout);
  };

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
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.background}>
        {workoutProgram && (
          <WorkoutProgram workout={workoutProgram} onUpdate={handleWorkoutUpdate} />
        )}
        <SafeAreaView style={styles.buttonRow}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.proceedButton}>
            <Text style={styles.proceedButtonText}>Save</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#1b1d21",
    padding: 10,
  },
  screen: {
    flex: 1,
    backgroundColor: "#1b1d21",
  },
  loadingText: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    width: 100,
    backgroundColor: '#FF4C4C',
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  proceedButton: {
    width: 100,
    backgroundColor: "#1B55AC",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  proceedButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
});

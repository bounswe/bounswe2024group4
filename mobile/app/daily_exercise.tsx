import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
}

const ExerciseScreen = () => {
  const router = useRouter();
  const { day, exercises } = useLocalSearchParams();

  const dayString = Array.isArray(day) ? day[0] : day;
  const exercisesString = Array.isArray(exercises) ? exercises[0] : exercises;

  const parsedExercises: Exercise[] = exercisesString
    ? JSON.parse(exercisesString)
    : [];

  
  const [exerciseStatus, setExerciseStatus] = useState<Record<string, boolean>>(
    () =>
      parsedExercises.reduce(
        (status, exercise) => ({ ...status, [exercise.id]: false }),
        {}
      )
  );

  const handleToggleExercise = (exerciseId: string) => {
    setExerciseStatus((prevStatus) => ({
      ...prevStatus,
      [exerciseId]: !prevStatus[exerciseId], 
    }));
  };

  const handleFinish = () => {
    const completedData = parsedExercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      completed: exerciseStatus[exercise.id],
    }));

    Alert.alert("Exercise Finished", "Your progress has been saved!", [
      { text: "OK", onPress: () => router.back() },
    ]);

    console.log("Completed Exercises:", completedData);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Exercises for {dayString}</Text>
      {parsedExercises.map((exercise) => (
        <View
          key={exercise.id}
          style={[
            styles.exerciseContainer,
            exerciseStatus[exercise.id] && styles.completedExerciseContainer,
          ]}
        >
          <TouchableOpacity
            style={[
              styles.checkbox,
              exerciseStatus[exercise.id] && styles.checkedCheckbox,
            ]}
            onPress={() => handleToggleExercise(exercise.id)}
          >
            {exerciseStatus[exercise.id] && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.exerciseText}>
            {exercise.name} - {exercise.sets} sets x {exercise.reps} reps
          </Text>
        </View>
      ))}

      <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
        <Text style={styles.finishButtonText}>Finish</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1d21",
    padding: 10,
  },
  header: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  exerciseContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#2B2F36",
    padding: 10,
    borderRadius: 5,
  },
  completedExerciseContainer: {
    backgroundColor: "#4CAF50", 
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedCheckbox: {
    backgroundColor: "#FFFFFF",
  },
  checkmark: {
    color: "black",
    fontWeight: "bold",
  },
  exerciseText: {
    color: "#A1A5AD",
    fontSize: 16,
    flex: 1,
  },
  finishButton: {
    backgroundColor: "#FF5252",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  finishButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ExerciseScreen;

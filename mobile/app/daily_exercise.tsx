import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Exercise {
  exercise_id: string;
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  instruction: string;
  sets: number;
  reps: number;
  is_completed?: boolean; 
}

interface Workout {
  workout_id: string;
  workout_name: string;
  exercises: Exercise[];
}

interface WorkoutDay {
  day_number: number;
  workout: Workout;
}

interface Program {
  program_id: string;
  days_per_week: number;
  workouts: WorkoutDay[];
}

const baseURL = "http://" + process.env.EXPO_PUBLIC_API_URL + ":8000";

const reorderedDaysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const mapToReorderedIndex = (originalIndex: number) => (originalIndex + 6) % 7;

const DailyExerciseScreen = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "User not authenticated.");
          return;
        }

        const config = { headers: { Authorization: `Token ${token}` } };
        const response = await axios.get<Program[]>(`${baseURL}/get-programs/`, config);

        const allPrograms = response.data;

        const adjustedPrograms = allPrograms.map((program) => ({
          ...program,
          workouts: program.workouts.map((workout) => ({
            ...workout,
            day_number: mapToReorderedIndex(workout.day_number),
          })),
        }));

        setPrograms(adjustedPrograms);

        // Automatically select the latest program
        if (adjustedPrograms.length > 0) {
          const latestProgram = adjustedPrograms[adjustedPrograms.length - 1];
          setSelectedProgram(latestProgram);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
        Alert.alert("Error", "Failed to fetch programs.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const handleSelectDay = (dayIndex: number) => {
    setSelectedDay(dayIndex);

    const workoutForDay = selectedProgram?.workouts.find(
      (workout) => workout.day_number === dayIndex
    )?.workout;

    if (workoutForDay) {
      const updatedWorkout = {
        ...workoutForDay,
        exercises: workoutForDay.exercises.map((exercise) => ({
          ...exercise,
          is_completed: false,
        })),
      };
      setSelectedWorkout(updatedWorkout);
    } else {
      Alert.alert("No Workout", "No workout is assigned for this day.");
    }
  };

  const handleToggleExercise = (exerciseId: string) => {
    if (!selectedWorkout) return;

    const updatedWorkout = {
      ...selectedWorkout,
      exercises: selectedWorkout.exercises.map((exercise) =>
        exercise.exercise_id === exerciseId
          ? { ...exercise, is_completed: !exercise.is_completed }
          : exercise
      ),
    };

    setSelectedWorkout(updatedWorkout);
  };

  const handleEndExercise = async () => {
    if (!selectedWorkout) return;

    const formattedExercises = selectedWorkout.exercises.map((exercise) => ({
      exercise_id: exercise.exercise_id,
      is_completed: !!exercise.is_completed,
    }));

    const body = {
      workout_completed: selectedWorkout.exercises.every((exercise) => exercise.is_completed),
      exercises: formattedExercises,
    };

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User not authenticated.");
        return;
      }

      const config = { headers: { Authorization: `Token ${token}` } };

      await axios.post(`${baseURL}/workout-log/${selectedWorkout.workout_id}/`, body, config);

      Alert.alert("Success", "Workout logged successfully!");
      setSelectedDay(null);
      setSelectedWorkout(null);
    } catch (error) {
      console.error("Error saving workout log:", error);
      Alert.alert("Error", "Failed to save workout log.");
    }
  };

  const renderOverview = () => (
    <ScrollView contentContainerStyle={{ paddingBottom: 60 }} style={styles.container}>
      <Text style={styles.title}>Weekly Overview</Text>
      {reorderedDaysOfWeek.map((day, index) => {
        const dayWorkouts = selectedProgram?.workouts.filter(
          (workout) => workout.day_number === index
        );

        return (
          <View key={day} style={styles.dayContainer}>
            <Text style={styles.dayTitle}>{day}</Text>
            {dayWorkouts?.length ? (
              dayWorkouts.map((workout, idx) => (
                <View key={`${day}-${idx}`} style={styles.workoutContainer}>
                  <Text style={styles.workoutTitle}>{workout.workout.workout_name}</Text>
                  {workout.workout.exercises.map((exercise, exIdx) => (
                    <Text key={`${workout.workout.workout_id}-${exIdx}`} style={styles.exerciseText}>
                      - {exercise.name}: {exercise.sets} sets x {exercise.reps} reps
                    </Text>
                  ))}
                </View>
              ))
            ) : (
              <Text style={styles.noWorkoutText}>No workout assigned</Text>
            )}
            <TouchableOpacity
              onPress={() => handleSelectDay(index)}
              style={styles.viewDayButton}
            >
              <Text style={styles.viewDayButtonText}>Start Exercise</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );

  const renderSelectedWorkout = () => (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {reorderedDaysOfWeek[selectedDay as number]} - {selectedWorkout?.workout_name}
      </Text>
      {selectedWorkout?.exercises.map((exercise) => (
        <TouchableOpacity
          key={exercise.exercise_id}
          onPress={() => handleToggleExercise(exercise.exercise_id)}
          style={styles.exerciseContainer}
        >
          <Text
            style={[
              styles.exerciseText,
              exercise.is_completed && styles.completedExerciseText,
            ]}
          >
            {exercise.name} - {exercise.sets} sets x {exercise.reps} reps
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={handleEndExercise} style={styles.completeButton}>
        <Text style={styles.completeButtonText}>Complete and Log</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#FFFFFF" />;
  }

  return selectedDay === null ? renderOverview() : renderSelectedWorkout();
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#1e1e1e", 
    padding: 15 
  },
  title: { 
    color: "#FFF", 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 15 
  },
  dayContainer: { 
    marginBottom: 15, 
    padding: 10, 
    backgroundColor: "#333", 
    borderRadius: 10 
  },
  dayTitle: { 
    color: "#FFF", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  workoutContainer: { 
    marginTop: 5 
  },
  workoutTitle: { 
    color: "#4CAF50", 
    fontSize: 14, 
    fontWeight: "bold" 
  },
  exerciseText: { 
    color: "#DDD", 
    fontSize: 12, 
    marginLeft: 10 
  },
  noWorkoutText: { 
    color: "#CCC", 
    fontSize: 12, 
    fontStyle: "italic" 
  },
  viewDayButton: { 
    marginTop: 10, 
    padding: 10, 
    backgroundColor: "#2196F3", 
    borderRadius: 8 
  },
  viewDayButtonText: { 
    color: "#FFF", 
    textAlign: "center", 
    fontSize: 14 
  },
  exerciseContainer: { 
    marginTop: 5, 
    padding: 10, 
    backgroundColor: "#444", 
    borderRadius: 8 
  },
  completedExerciseText: { 
    textDecorationLine: "line-through", 
    color: "#4CAF50" 
  },
  completeButton: { 
    marginTop: 20, 
    padding: 15, 
    backgroundColor: "#4CAF50", 
    borderRadius: 10 
  },
  completeButtonText: { 
    color: "#FFF", 
    fontSize: 16, 
    textAlign: "center" 
  },
});


export default DailyExerciseScreen;

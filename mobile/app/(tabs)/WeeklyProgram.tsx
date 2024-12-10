import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useRouter, useGlobalSearchParams } from "expo-router";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
}

interface Program {
  id: string;
  workout_name: string;
  exercises: Exercise[];
}

const baseURL = "http://" + process.env.EXPO_PUBLIC_API_URL + ":8000";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const WeeklyProgram = () => {
  const { viewingUser, viewedUser } = useGlobalSearchParams();
  const router = useRouter();
  const [workoutPrograms, setWorkoutPrograms] = useState<Program[]>([]);
  const [weekPrograms, setWeekPrograms] = useState<Record<string, Program[]>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const userToFetch = viewedUser || viewingUser;
        if (!userToFetch) {
          return;
        }
        const response = await axios.get(`${baseURL}/get-workouts/?username=${userToFetch}`);
        setWorkoutPrograms(response.data);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch workouts.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [viewedUser, viewingUser]);

  const handleAddProgram = (day: string, program: Program) => {
    setWeekPrograms((prev) => ({
      ...prev,
      [day]: prev[day] ? [...prev[day], program] : [program],
    }));
    setModalVisible(false);
  };

  const handleRemoveProgram = (day: string, programId: string) => {
    setWeekPrograms((prev) => ({
      ...prev,
      [day]: prev[day]?.filter((program) => program.id !== programId),
    }));
  };

  const handleStartExercise = (day: string) => {
    const programsForDay = weekPrograms[day];
    if (!programsForDay || programsForDay.length === 0) {
      Alert.alert("No Programs", `No programs assigned for ${day}.`);
      return;
    }

    const exercises = programsForDay.flatMap((program) => program.exercises);
    router.push({
      pathname: "/daily_exercise",
      params: { day, exercises: JSON.stringify(exercises) },
    });
  };

  const renderDay = (day: string) => (
    <View key={`day-${day}`} style={styles.dayContainer}>
      <Text style={styles.dayTitle}>{day}</Text>
      {weekPrograms[day]?.map((program) => (
        <View key={`program-${program.id}`} style={styles.programContainer}>
          <Text style={styles.programTitle}>{program.workout_name}</Text>
          {program.exercises.map((exercise) => (
            <Text key={`exercise-${exercise.id ?? exercise.name}`} style={styles.exerciseText}>
              {exercise.name} - {exercise.sets} sets x {exercise.reps} reps
            </Text>
          ))}
          <TouchableOpacity
            onPress={() => handleRemoveProgram(day, program.id)}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        onPress={() => {
          setSelectedDay(day);
          setModalVisible(true);
        }}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>Add Program</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleStartExercise(day)}
        style={styles.startButton}
      >
        <Text style={styles.startButtonText}>Start Exercise</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading workout programs...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Weekly Exercise Program</Text>
      {daysOfWeek.map(renderDay)}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Select a Program</Text>
          <FlatList
            data={workoutPrograms}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleAddProgram(selectedDay!, item)}
                style={styles.modalProgram}
              >
                <Text style={styles.modalProgramText}>{item.workout_name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.modalCancelButton}
          >
            <Text style={styles.modalCancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
  },
  loadingText: {
    marginTop: 10,
    color: "#ffffff",
  },
  header: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  dayContainer: {
    marginBottom: 20,
    backgroundColor: "#333333",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  dayTitle: {
    color: "#2196F3",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  programContainer: {
    marginTop: 10,
    backgroundColor: "#444444",
    padding: 15,
    borderRadius: 10,
  },
  programTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  exerciseText: {
    color: "#cccccc",
    fontSize: 14,
  },
  addButton: {
    marginTop: 15,
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  startButton: {
    marginTop: 10,
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    marginTop: 5,
    backgroundColor: "#FF5252",
    padding: 6,
    borderRadius: 20,
    alignItems: "center",
    width: 30,
    height: 30,
  },
  removeButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
  },
  modalHeader: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalProgram: {
    padding: 15,
    backgroundColor: "#333333",
    marginBottom: 10,
    borderRadius: 10,
  },
  modalProgramText: {
    color: "white",
    fontSize: 16,
  },
  modalCancelButton: {
    marginTop: 20,
    backgroundColor: "#FF5252",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WeeklyProgram;


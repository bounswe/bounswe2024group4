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
import { useRouter } from "expo-router";

interface Exercise {
  exercise_id: string;
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  instruction: string;
  sets: number;
  reps: number;
}

interface Workout {
  workout_id: string;
  workout_name: string;
  exercises: Exercise[];
}

interface CreatedBy {
  user_id: string;
  username: string;
}

interface WorkoutDay {
  day_number: number;
  workout: Workout;
}

interface Program {
  program_id: string;
  days_per_week: number;
  created_by: CreatedBy;
  workouts: WorkoutDay[];
}

const baseURL = "http://" + process.env.EXPO_PUBLIC_API_URL + ":8000";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function LastFiveScreen() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

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
        setPrograms(response.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
        Alert.alert("Error", "Failed to fetch programs.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const handleNavigateToDaily = () => {
    router.push("/daily_exercise");
  };

  const renderProgram = (program: Program) => (
    <View style={styles.programContainer} key={program.program_id}>
      <Text style={styles.programTitle}>Program ID: {program.program_id}</Text>
      <Text style={styles.programSubtitle}>
        Days Per Week: {program.days_per_week}
      </Text>
      <Text style={styles.programSubtitle}>
        Created By: {program.created_by.username}
      </Text>
      {program.workouts.map((workout: WorkoutDay, index: number) => (
        <View key={index} style={styles.workoutContainer}>
          <Text style={styles.workoutDay}>{daysOfWeek[workout.day_number % 7]}</Text>
          <Text style={styles.workoutTitle}>
            Workout: {workout.workout.workout_name}
          </Text>
        </View>
      ))}
    </View>
  );

  const lastFivePrograms = programs.slice(-5).reverse();

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 60 }} style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FFFFFF" />
      ) : lastFivePrograms.length > 0 ? (
        <>
          {lastFivePrograms.map(renderProgram)}
          <TouchableOpacity
            onPress={handleNavigateToDaily}
            style={styles.dailyButton}
          >
            <Text style={styles.dailyButtonText}>Daily</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.noProgramsText}>No programs available</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: "#1e1e1e", 
      padding: 15 
    },
    programContainer: { 
      marginBottom: 20, 
      backgroundColor: "#333", 
      padding: 15, 
      borderRadius: 10 
    },
    programTitle: { 
      color: "#FFF", 
      fontSize: 18, 
      fontWeight: "bold" 
    },
    programSubtitle: { 
      color: "#CCC", 
      fontSize: 14, 
      marginVertical: 5 
    },
    workoutContainer: { 
      marginTop: 10, 
      padding: 10, 
      backgroundColor: "#444", 
      borderRadius: 8 
    },
    workoutDay: { 
      color: "#4CAF50", 
      fontSize: 16, 
      fontWeight: "bold" 
    },
    workoutTitle: { 
      color: "#FFF", 
      fontSize: 14, 
      marginTop: 5 
    },
    noProgramsText: { 
      color: "#FFF", 
      fontSize: 16, 
      textAlign: "center", 
      marginTop: 20 
    },
    dailyButton: { 
      marginTop: 20, 
      padding: 15, 
      backgroundColor: "#4CAF50", 
      borderRadius: 10 
    },
    dailyButtonText: { 
      color: "#FFF", 
      fontSize: 16, 
      textAlign: "center" 
    },
  });
  

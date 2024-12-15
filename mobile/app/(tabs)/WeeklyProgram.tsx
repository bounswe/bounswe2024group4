import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  day?: string;
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

const WeeklyProgram: React.FC = () => {
  const router = useRouter();
  const [weekPrograms, setWeekPrograms] = useState<Program[]>([]);
  const [currentDay, setCurrentDay] = useState<string | null>(null);
  const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "User not authenticated.");
          return;
        }

        const config = { headers: { Authorization: `Token ${token}` } };

        const response = await axios.get(`${baseURL}/get-workouts/`, config);
        setAvailablePrograms(response.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
        Alert.alert("Error", "Failed to fetch programs.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const handleAddProgram = (day: string, programToAdd: Program) => {
    setWeekPrograms((prev) => {
      const isDuplicate = prev.some(
        (program) => program.day === day && program.id === programToAdd.id
      );
      if (!isDuplicate) {
        return [...prev, { ...programToAdd, day }];
      }
      return prev;
    });
    setModalVisible(false);
  };

  const handleRemoveProgram = (day: string, programId: string) => {
    setWeekPrograms((prev) =>
      prev.filter((program) => !(program.day === day && program.id === programId))
    );
  };

  const saveWeeklyProgram = async () => {
    const workoutsData: Record<number, string> = {};
    weekPrograms.forEach((program) => {
      workoutsData[daysOfWeek.indexOf(program.day || "") + 1] = program.id;
    });

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User not authenticated.");
        return;
      }

      const config = { headers: { Authorization: `Token ${token}` } };

      const response = await axios.post(
        `${baseURL}/create-program/`,
        { workouts: workoutsData },
        config
      );

      console.log("Program saved successfully:", response.data);
      Alert.alert("Success", "Weekly program saved successfully!");
    } catch (error) {
      console.error("Error saving program:", error);
      Alert.alert("Error", "Failed to save weekly program.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading programs...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 60 }} style={styles.container}>
      <Text style={styles.header}>Weekly Exercise Program</Text>
      {daysOfWeek.map((day) => {
        const dayPrograms = weekPrograms.filter((program) => program.day === day);
        return (
          <View key={day} style={styles.dayContainer}>
            <Text style={styles.dayTitle}>{day}</Text>
            <View style={styles.exercisesContainer}>
              {dayPrograms.length > 0 ? (
                dayPrograms.map((program, programIndex) => (
                  <View key={`${day}-${program.id || programIndex}`} style={styles.programContainer}>
                    <Text style={styles.programTitle}>{program.workout_name}</Text>
                    {program.exercises.map((exercise, exerciseIndex) => (
                      <Text
                        key={`${program.id}-${exercise.id || exerciseIndex}`}
                        style={styles.exerciseText}
                      >
                        - {exercise.name}: {exercise.sets} sets x {exercise.reps} reps
                      </Text>
                    ))}
                    <TouchableOpacity
                      onPress={() => handleRemoveProgram(day, program.id)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.noProgramText}>No programs assigned</Text>
              )}
              <TouchableOpacity
                onPress={() => {
                  setCurrentDay(day);
                  setModalVisible(true);
                }}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>Add Program</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      <TouchableOpacity onPress={saveWeeklyProgram} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Weekly Program</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/last_five_programs")}
        style={styles.lastFiveButton}
      >
        <Text style={styles.lastFiveButtonText}>View Last 5 Weekly Exercises</Text>
      </TouchableOpacity>

      {/* Modal for Adding Programs */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select a Program</Text>
            <FlatList
              data={availablePrograms}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleAddProgram(currentDay!, item)}
                  style={styles.programItem}
                >
                  <Text style={styles.programItemText}>{item.workout_name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.programListContainer}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#1e1e1e", 
    padding: 15 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  loadingText: { 
    color: "#FFF", 
    fontSize: 18 
  },
  header: { 
    color: "#FFF", 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 20 
  },
  dayContainer: { 
    backgroundColor: "#333", 
    marginBottom: 15, 
    borderRadius: 10, 
    padding: 10 
  },
  dayTitle: { 
    color: "#FFF", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  exercisesContainer: { 
    marginTop: 10 
  },
  programContainer: { 
    backgroundColor: "#444", 
    padding: 10, 
    borderRadius: 8, 
    marginBottom: 10 
  },
  programTitle: { 
    color: "#FFF", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  exerciseText: { 
    color: "#DDD", 
    fontSize: 14, 
    marginLeft: 10 
  },
  removeButton: { 
    alignSelf: "flex-end", 
    marginTop: 5 
  },
  removeButtonText: { 
    color: "#FF5252", 
    fontSize: 14 
  },
  noProgramText: { 
    color: "#CCC", 
    fontSize: 14, 
    textAlign: "center", 
    marginVertical: 10 
  },
  addButton: { 
    backgroundColor: "#4CAF50", 
    padding: 10, 
    borderRadius: 8, 
    alignItems: "center", 
    marginTop: 10 
  },
  addButtonText: { 
    color: "#FFF", 
    fontSize: 16 
  },
  saveButton: { 
    marginTop: 20, 
    padding: 15, 
    backgroundColor: "#FFD700", 
    borderRadius: 10 
  },
  saveButtonText: { 
    color: "#333", 
    fontWeight: "bold", 
    textAlign: "center" 
  },
  lastFiveButton: { 
    marginTop: 20, 
    padding: 15, 
    backgroundColor: "#2196F3", 
    borderRadius: 10 
  },
  lastFiveButtonText: { 
    color: "#FFF", 
    textAlign: "center", 
    fontSize: 16 
  },
  modalOverlay: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.6)", 
    paddingHorizontal: 20 
  },
  modalContent: { 
    width: "100%", 
    maxHeight: "80%", 
    backgroundColor: "#222", 
    borderRadius: 15, 
    padding: 20, 
    shadowColor: "#000", 
    shadowOffset: { 
      width: 0, 
      height: 2 
    }, 
    shadowOpacity: 0.8, 
    shadowRadius: 10, 
    elevation: 5 
  },
  modalHeader: { 
    color: "#FFF", 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 15, 
    textAlign: "center" 
  },
  programListContainer: { 
    paddingVertical: 10 
  },
  programItem: { 
    padding: 15, 
    backgroundColor: "#444", 
    borderRadius: 10, 
    marginBottom: 10 
  },
  programItemText: { 
    color: "#FFF", 
    fontSize: 16, 
    fontWeight: "600" 
  },
  closeButton: { 
    marginTop: 15, 
    backgroundColor: "#FF5252", 
    padding: 12, 
    borderRadius: 8, 
    alignItems: "center" 
  },
  closeButtonText: { 
    color: "#FFF", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});


export default WeeklyProgram;

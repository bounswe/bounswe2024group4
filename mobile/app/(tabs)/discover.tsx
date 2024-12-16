import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = "http://" + process.env.EXPO_PUBLIC_API_URL + ":8000";

const DiscoverScreen = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);
      try {
        // Token al
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setError("You are not authenticated. Please log in.");
          return;
        }

        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };

        // API uç noktalarından veri çek
        const [mealActivities, workoutActivities, workoutLogActivities] =
          await Promise.all([
            axios.get(`${baseURL}/get_meal_activities/`, config),
            axios.get(`${baseURL}/workout-activities/`, config),
            axios.get(`${baseURL}/get-workout-log-activities/`, config),
          ]);

        // Verileri birleştir
        const allActivities = [
          ...mealActivities.data.activities,
          ...workoutActivities.data.activities,
          ...workoutLogActivities.data.activities,
        ];

        // Tarihe göre sırala
        const sortedActivities = allActivities.sort(
          (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
        );

        setActivities(sortedActivities.slice(0, 50)); // İlk 50 aktivite
      } catch (error) {
        console.error("Error fetching activities:", error);
        setError("Failed to fetch activities. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#609FFF" />
        <Text style={styles.loadingText}>Fetching latest activities...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderActivity = ({ item }: { item: any }) => {
    const icon =
      item.type === "Log"
        ? "🏆"
        : item.object?.type === "Workout"
        ? "🏋️‍♂️"
        : "🍴";

    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.username}>{item.summary.split(" ")[0]}</Text>
          <Text style={styles.action}>
            {item.summary.split(" ").slice(1).join(" ").replace("logged", "completed")}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.published).toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={activities}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderActivity}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <Text style={styles.headerText}>Discover New Activities</Text>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No activities to display.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B55AC",
  },
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#1B55AC",
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 16,
    textAlign: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#162447",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1F4068",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#609FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
    color: "#FFFFFF",
  },
  cardContent: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  action: {
    fontSize: 14,
    color: "#DDDDDD",
    marginVertical: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#AAAAAA",
  },
});

export default DiscoverScreen;

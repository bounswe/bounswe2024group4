import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import WorkoutProgram from './WorkoutProgram';
import { Workout } from '../constants/types';

const allowedMuscles = [
  "chest", "biceps", "shoulders", "triceps", "middle_back",
  "lower_back", "traps", "abdominals", "quadriceps",
  "hamstrings", "glutes", "calves",
] as const;

const mapMuscleToEnum = (muscle: string) => {
  return allowedMuscles.includes(muscle as typeof allowedMuscles[number])
    ? (muscle as typeof allowedMuscles[number])
    : "chest";
};

const CreatePost = () => {
  const navigation = useNavigation();
  const [workouts, setWorkouts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setIsLoading(true);
      const username = await AsyncStorage.getItem('username');
      const token = await AsyncStorage.getItem('token');
      const baseURL = 'http://' + process.env.EXPO_PUBLIC_API_URL + ':8000';

      const response = await axios.get(
        `${baseURL}/get-workouts/?username=${username}`,
        {
          headers: {
            'Authorization': `Token ${token}`
          }
        }
      );
      setWorkouts(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch workouts');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setModalVisible(false);
  };

  const handleCreatePost = async () => {
    if (!selectedWorkout && !postContent) {
      Alert.alert('Error', 'Please provide content for the post and select a workout.');
      return;
    }

    try {
      setIsLoading(true);
      const username = await AsyncStorage.getItem('username');
      const token = await AsyncStorage.getItem('token');
      const baseURL = 'http://' + process.env.EXPO_PUBLIC_API_URL + ':8000';

      const body = {
        content: postContent,
        workoutId: parseInt(selectedWorkout?.id),
        username: username
      };

      await axios.post(
        `${baseURL}/post/`, 
        body,
        {
          headers: {
            'Authorization': `Token ${token}`
          }
        }
      );

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Create a Post</Text>
        
        <TextInput
          style={styles.textInput}
          value={postContent}
          onChangeText={setPostContent}
          placeholder="Write your post here..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
        />

        <View style={styles.workoutSelector}>
          <Text style={styles.label}>Select a workout:</Text>
          <TouchableOpacity 
            style={styles.workoutSelectButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.workoutSelectButtonText}>
              {selectedWorkout ? selectedWorkout.workout_name : 'Select a workout program'}
            </Text>
          </TouchableOpacity>
        </View>

        {selectedWorkout && (
          <View style={styles.selectedWorkout}>
            <WorkoutProgram
              workout={{
                id: selectedWorkout.id,
                name: selectedWorkout.workout_name,
                created_by: selectedWorkout.created_by,
                rating: selectedWorkout.rating,
                rating_count: selectedWorkout.rating_count,
                exercises: selectedWorkout.exercises.map((exercise) => ({
                  ...exercise,
                  muscle: mapMuscleToEnum(exercise.muscle),
                })),
              }}
              onUpdate={() => {}}
            />
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select a Workout</Text>
            <FlatList
              data={workouts}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.workoutItem}
                  onPress={() => handleSelectWorkout(item)}
                >
                  <Text style={styles.workoutItemText}>{item.workout_name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton, (!selectedWorkout && !postContent) && styles.buttonDisabled]}
          onPress={handleCreatePost}
          disabled={!selectedWorkout && !postContent}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1f26',
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1f26',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    marginBottom: 20,
    height: 100,
    textAlignVertical: 'top',
  },
  workoutSelector: {
    marginBottom: 20,
  },
  label: {
    color: 'white',
    marginBottom: 5,
  },
  workoutSelectButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
  },
  workoutSelectButtonText: {
    color: 'white',
  },
  selectedWorkout: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1c1f26',
    margin: 20,
    borderRadius: 8,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  workoutItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  workoutItemText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: '#1c1f26',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#6b7280',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default CreatePost;
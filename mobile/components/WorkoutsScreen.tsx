import React, { useState } from 'react';
import { SafeAreaView, FlatList, Text, Image, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';
import images from '../constants/image_map'; 

interface WorkoutProgram {
  id: string;
  workout_name: string;
  rating: number;
  rating_count: number; 
  exercises: {
    id: string;
    name: string;
    sets: number;
    reps: number;
    image?: string; 
    muscle?: string; 
  }[];
}

interface WorkoutsScreenProps {
  workoutPrograms: WorkoutProgram[];
  isOwnProfile: boolean; 
}

const WorkoutsScreen: React.FC<WorkoutsScreenProps> = ({ workoutPrograms, isOwnProfile }) => {
  const [selectedRating, setSelectedRating] = useState<{ [key: string]: number }>({});
  const baseURL = 'http://' + process.env.EXPO_PUBLIC_API_URL + ':8000';

  const handleRatingSubmit = async (programId: string) => {
    try {
      const rating = selectedRating[programId];
      if (!rating) {
        Alert.alert('Error', 'Please select a rating before submitting.');
        return;
      }

      const response = await axios.post(`${baseURL}/rate-workout/`, {
        workout_id: programId,
        rating,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Rating submitted successfully!');
      } else {
        Alert.alert('Error', 'Failed to submit rating. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Error', 'Failed to submit rating. Please check your connection.');
    }
  };

  const handleShare = (programName: string) => {
    Alert.alert('Share', `Shared workout: ${programName}`);
  };

  const renderWorkoutProgram = ({ item }: { item: WorkoutProgram }) => (
    <View style={styles.programContainer}>
      {/* Program Title */}
      <View style={styles.headerContainer}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.programTitle}>
          {item.workout_name}
        </Text>
        <View style={styles.iconRow}>
          {/* Rating */}
          {item.rating !== undefined && (
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={24} color="#FFD700" />
              <Text style={styles.ratingNumber}>
                {item.rating_count === 0
                  ? 'No votes yet'
                  : `${item.rating.toFixed(1)} (${item.rating_count} ${item.rating_count === 1 ? 'vote' : 'votes'})`}
              </Text>
            </View>
          )}
          {/* Share Button */}
          <TouchableOpacity onPress={() => handleShare(item.workout_name)}>
            <FontAwesome name="share" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Exercise List */}
      {item.exercises.map((exercise, index) => (
        <React.Fragment key={exercise.id || index.toString()}>
          <View style={styles.exerciseRow}>
            {exercise.image ? (
              // Display image from URL
              <Image source={{ uri: exercise.image }} style={styles.exerciseImage} />
            ) : exercise.muscle ? (
              // Display fallback muscle group image
              <Image
                source={images[exercise.muscle as keyof typeof images]}
                style={styles.exerciseImage}
              />
            ) : (
              // Placeholder for missing images
              <View style={styles.exerciseImagePlaceholder} />
            )}
            <View style={styles.exerciseDetails}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseSetsReps}>
                {exercise.sets} sets x {exercise.reps} reps
              </Text>
            </View>
          </View>
          {index < item.exercises.length - 1 && <View style={styles.separatorLine} />}
        </React.Fragment>
      ))}

      {/* Rating Section */}
      {!isOwnProfile && (
        <View style={styles.ratingSection}>
          <Text style={styles.ratingPrompt}>Rate this program:</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setSelectedRating((prev) => ({ ...prev, [item.id]: star }))}
              >
                <FontAwesome
                  name="star"
                  size={30}
                  color={star <= (selectedRating[item.id] || 0) ? '#FFD700' : '#CCC'}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => handleRatingSubmit(item.id)}
          >
            <Text style={styles.submitButtonText}>Submit Rating</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={workoutPrograms}
        renderItem={renderWorkoutProgram}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1d21',
  },
  listContainer: {
    padding: 10,
  },
  programContainer: {
    backgroundColor: '#0B2346',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: '#5C90E0',
    borderWidth: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  programTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
    marginRight: 10,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  ratingNumber: {
    color: '#FFD700',
    fontSize: 14,
    marginLeft: 5,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseImage: {
    width: 50,
    height: 50,
    marginRight: 20,
    marginLeft: 10,
    borderRadius: 8,
  },
  exerciseImagePlaceholder: {
    width: 50,
    height: 50,
    marginRight: 20,
    marginLeft: 10,
    backgroundColor: '#555',
    borderRadius: 5,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 16,
  },
  exerciseSetsReps: {
    color: '#bbb',
    fontSize: 14,
  },
  separatorLine: {
    height: 2,
    backgroundColor: '#5C90E0',
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 1,
  },
  ratingSection: {
    marginTop: 15,
  },
  ratingPrompt: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#5C90E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WorkoutsScreen;

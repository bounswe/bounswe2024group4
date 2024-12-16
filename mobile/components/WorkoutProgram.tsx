import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, Image, StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import WorkoutEdit from './WorkoutEdit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '../constants/image_map';
import { Workout } from '../constants/types';
import axios from 'axios';


interface WorkoutProgramProps {
  workout: Workout;
  onUpdate: (updatedWorkout: Workout) => void;
  isEditable?: boolean;
  showRating?: boolean;
}

const baseURL = 'http://' + process.env.EXPO_PUBLIC_API_URL + ':8000';

const WorkoutProgram: React.FC<WorkoutProgramProps> = ({ 
  workout, 
  onUpdate,
  isEditable = false,
  showRating = false,
}) => {
  const [currentWorkout, setCurrentWorkout] = useState<Workout>(workout);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(currentWorkout.rating);
  const [ratingCount, setRatingCount] = useState(currentWorkout.rating_count);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleShare = () => {
    console.log(`Sharing workout: ${currentWorkout.name}`);
  };

  const handleEdit = () => {
    setIsModalVisible(true);
  };

  const handleSave = (updatedWorkout: Workout) => {
    setCurrentWorkout(updatedWorkout);
    onUpdate(updatedWorkout);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const config = {
          headers: {
            'Authorization': `Token ${token}`
          }
        };

        const response = await axios.get(
          `${baseURL}/get-bookmarked-workouts/`,
          config
        );

        if (response.status === 200) {
          const bookmarkedWorkoutIds = response.data.map((workout: any) => workout.id);
          setIsBookmarked(bookmarkedWorkoutIds.includes(currentWorkout.id));
        }
      } catch (error) {
        console.error("Error fetching bookmark status:", error);
      }
    };

    fetchBookmarkStatus();
  }, [currentWorkout.id]);

  const toggleBookmark = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const config = {
        headers: {
          'Authorization': `Token ${token}`
        }
      };

      const response = await axios.post(
        `${baseURL}/workouts/toggle-bookmark/`,
        {
          workout_id: currentWorkout.id,
        },
        config
      );

      if (response.status === 200) {
        setIsBookmarked(prev => !prev);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleRating = async (selectedRating: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          'Authorization': `Token ${token}`        
        }
      };
  
      const response = await axios.post(`${baseURL}/rate-workout/`, {
        workout_id: currentWorkout.id,
        rating: selectedRating
      }, config);
  
      if (response.status === 200) {
        setRating(selectedRating);
        // Update the average rating and count
        const newTotalRatings = ratingCount + 1;
        const newAverageRating = 
          ((averageRating * ratingCount) + selectedRating) / newTotalRatings;
        setRatingCount(newTotalRatings);
        setAverageRating(newAverageRating);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const RatingStars = () => {
    return (
      <View style={styles.inlineRatingContainer}>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => handleRating(star)}
              style={styles.compactStarButton}
            >
              <FontAwesome
                name="star"
                size={24}
                color={star <= rating ? "#FFD700" : "rgba(255, 215, 0, 0.3)"}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const toggleExercise = (index: number) => {
    setExpandedExercise(expandedExercise === index ? null : index);
  };

  const renderExerciseCard = (exercise: any, index: number) => {
    const isExpanded = expandedExercise === index;
    const instructionText = exercise.instruction ?? exercise.instructions;

    return (
      <TouchableOpacity 
        key={`${exercise.id}-${index}`}
        style={styles.exerciseCard}
        onPress={() => toggleExercise(index)}
        activeOpacity={0.9}
      >
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseImageContainer}>
            {exercise.muscle ? (
              <Image 
                source={images[exercise.muscle as keyof typeof images]} 
                style={styles.exerciseImage} 
              />
            ) : (
              <View style={styles.exerciseImagePlaceholder} />
            )}
          </View>
          
          <View style={styles.exerciseMainInfo}>
            <Text style={styles.exerciseName} numberOfLines={2}>
              {exercise.name}
            </Text>
            <View style={styles.exerciseMetrics}>
              <Text style={styles.metrics}>{exercise.sets} sets • {exercise.reps} reps</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.expandButton} 
            onPress={() => toggleExercise(index)}
          >
            <FontAwesome 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={16} 
              color="#5C90E0" 
            />
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={styles.exerciseContent}>
            <Text style={styles.exerciseInstruction}>
              {instructionText}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.programContainer}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.programTitle} numberOfLines={2}>
            {currentWorkout.workout_name}
          </Text>
        </View>
        
        <View style={styles.ratingAndActions}>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={18} color="#FFD700" />
            <Text style={styles.ratingNumber}>{averageRating.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({ratingCount})</Text>
          </View>
          
          <View style={styles.headerActions}>
          {!isEditable ? (
          <>
            <TouchableOpacity onPress={toggleBookmark} style={styles.iconButton}>
              <FontAwesome
                name={isBookmarked ? "bookmark" : "bookmark-o"}
                size={20}
                color="#5C90E0"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
              <FontAwesome name="share-alt" size={20} color="#5C90E0" />
            </TouchableOpacity>
          </>
            ) : (
              <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
                <FontAwesome name="edit" size={20} color="#5C90E0" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>


      <View style={styles.exerciseList}>
        {currentWorkout.exercises.map((exercise, index) => renderExerciseCard(exercise, index))}
      </View>

      {showRating && (
        <View style={styles.ratingSection}>
          <RatingStars />
        </View>
      )}

      {isEditable && isModalVisible && (
        <WorkoutEdit
          workout={currentWorkout}
          isVisible={isModalVisible}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  programContainer: {
    backgroundColor: '#0B2346',
    borderRadius: 12,
    borderColor: '#1a3865',
    borderWidth: 1,
    marginTop: 12,
  },
  header: {
    padding: 16,
    paddingBottom: 12,
  },
  titleRow: {
    marginBottom: 8,
  },
  ratingAndActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  programTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    lineHeight: 32,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(92, 144, 224, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingNumber: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  ratingCount: {
    color: '#8396B8',
    fontSize: 14,
    marginLeft: 4,
  },
  exerciseList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  exerciseCard: {
    backgroundColor: 'rgba(92, 144, 224, 0.05)',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(92, 144, 224, 0.2)',
  },
  exerciseHeader: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  exerciseImageContainer: {
    marginRight: 12,
  },
  exerciseMainInfo: {
    flex: 1,
    marginRight: 8,
  },
  exerciseContent: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(92, 144, 224, 0.1)',
  },
  exerciseImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  exerciseImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(92, 144, 224, 0.2)',
  },
  exerciseName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    flexWrap: 'wrap',
    lineHeight: 22,
  },
  exerciseMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metrics: {
    color: '#8396B8',
    fontSize: 14,
  },
  exerciseInstruction: {
    color: '#8396B8',
    fontSize: 14,
    lineHeight: 20,
  },
  expandButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(92, 144, 224, 0.1)',
    borderRadius: 14,
  },
  compactRatingSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 4,
  },
  inlineRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(92, 144, 224, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(92, 144, 224, 0.2)',
    paddingVertical: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactStarButton: {
    padding: 4,
  },
});

export default WorkoutProgram;
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Exercise {
  id: string;
  image: any;
  name: string;
  sets: number;
  reps: number;
}

interface WorkoutProgramProps {
  workout: {
    id: string;
    name: string;
    exercises: Exercise[];
    rating?: string;
  };
}

const WorkoutProgram: React.FC<WorkoutProgramProps> = ({ workout }) => {
  
  const handleShare = () => {
    console.log(`Sharing workout: ${workout.name}`);
    // Will be implemented later
  };

  return (
    <View style={styles.programContainer}>
      <View style={styles.headerContainer}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.programTitle}>{workout.name}</Text>
        {workout.rating && (
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={handleShare}>
              <FontAwesome name="share" size={24} color="#fff" style={styles.icon} />
            </TouchableOpacity>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={24} color="#FFD700" />
              <Text style={styles.ratingNumber}>{workout.rating}</Text>
            </View>
          </View>
        )}
      </View>
      {workout.exercises.map((exercise) => (
        <View key={exercise.id} style={styles.exerciseRow}>
          <Image source={exercise.image} style={styles.exerciseImage} />
          <View style={styles.exerciseDetails}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseSetsReps}>
              {exercise.sets} sets x {exercise.reps} reps
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  programContainer: {
    backgroundColor: '#0B2346',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: '#5C90E0',
    borderWidth: 2,
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
    alignItems: 'center',
    marginLeft: 10,
    flexDirection: 'row',
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
});

export default WorkoutProgram;

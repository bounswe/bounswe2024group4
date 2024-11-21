import React, { useState } from 'react';
import { SafeAreaView, Text, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import WorkoutEdit from './WorkoutEdit';

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
  const [currentWorkout, setCurrentWorkout] = useState(workout);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleShare = () => {
    console.log(`Sharing workout: ${currentWorkout.name}`);
  };

  const handleEdit = () => {
    setIsModalVisible(true);
  };

  const handleSave = (updatedWorkout: typeof currentWorkout) => {
    setCurrentWorkout(updatedWorkout);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.programContainer}>
      <SafeAreaView style={styles.headerContainer}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.programTitle}>{currentWorkout.name}</Text>
        <SafeAreaView style={styles.iconRow}>
          {workout.rating && (
            <SafeAreaView style={styles.ratingContainer}>
              <FontAwesome name="star" size={24} color="#FFD700" />
              <Text style={styles.ratingNumber}>{workout.rating}</Text>
            </SafeAreaView>
          )}
          <TouchableOpacity onPress={handleShare}>
            <FontAwesome name="share" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEdit}>
            <FontAwesome name="edit" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>

      {currentWorkout.exercises.map((exercise, index) => (
        <React.Fragment key={exercise.id}>
          <SafeAreaView style={styles.exerciseRow}>
            <Image source={exercise.image} style={styles.exerciseImage} />
            <SafeAreaView style={styles.exerciseDetails}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseSetsReps}>
                {exercise.sets} sets x {exercise.reps} reps
              </Text>
            </SafeAreaView>
          </SafeAreaView>
          {index < currentWorkout.exercises.length - 1 && (
            <View style={styles.separatorLine} />
          )}
        </React.Fragment>
      ))}

      {/* Modal for editing workout */}
      {isModalVisible && (
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
  separatorLine: {
    height: 1,
    backgroundColor: '#5C90E0',
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 1,
    marginHorizontal: 0,
  },
});

export default WorkoutProgram;

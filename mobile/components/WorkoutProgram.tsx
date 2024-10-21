import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
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
  const [currentWorkout, setCurrentWorkout] = useState(workout);
  const [editableWorkout, setEditableWorkout] = useState({
    name: workout.name,
    exercises: workout.exercises.map(ex => ({ ...ex }))
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleShare = () => {
    console.log(`Sharing workout: ${currentWorkout.name}`);
  };

  const handleEdit = () => {
    setEditableWorkout({
      name: currentWorkout.name,
      exercises: currentWorkout.exercises.map(ex => ({ ...ex })),
    });
    setIsModalVisible(true);
  };

  const handleSave = () => {
    const updatedWorkout = {
      ...currentWorkout,
      name: editableWorkout.name,
      exercises: editableWorkout.exercises.map(ex => ({
        ...ex,
        sets: isNaN(ex.sets) ? 0 : ex.sets,
        reps: isNaN(ex.reps) ? 0 : ex.reps,
      })),
    };
  
    setCurrentWorkout(updatedWorkout);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setEditableWorkout({
      name: currentWorkout.name,
      exercises: currentWorkout.exercises.map(ex => ({ ...ex })),
    });
    setIsModalVisible(false);
  };

  const handleInputChange = (value: string, index: number, field: 'sets' | 'reps') => {
    let numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || value === '') {
      numericValue = 0;
    }

    const updatedExercises = [...editableWorkout.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: numericValue,
    };

    setEditableWorkout({
      ...editableWorkout,
      exercises: updatedExercises,
    });
  };

  return (
    <View style={styles.programContainer}>
      <View style={styles.headerContainer}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.programTitle}>{currentWorkout.name}</Text>
        <View style={styles.iconRow}>
          {workout.rating && (
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={24} color="#FFD700" />
              <Text style={styles.ratingNumber}>{workout.rating}</Text>
            </View>
          )}
          <TouchableOpacity onPress={handleShare}>
            <FontAwesome name="share" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEdit}>
            <FontAwesome name="edit" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      {currentWorkout.exercises.map((exercise) => (
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

      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            value={editableWorkout.name}
            onChangeText={text => setEditableWorkout({ ...editableWorkout, name: text })}
            placeholder="Workout Name"
          />
          {editableWorkout.exercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseEditRow}>
              <Text>{exercise.name}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={exercise.sets.toString()}
                onChangeText={text => handleInputChange(text, index, 'sets')}
                placeholder="Sets"
              />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={exercise.reps.toString()}
                onChangeText={text => handleInputChange(text, index, 'reps')}
                placeholder="Reps"
              />
            </View>
          ))}
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={handleCancel} />
        </View>
      </Modal>
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
  modalContainer: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
  },
  exerciseEditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default WorkoutProgram;

import React from 'react';
import { Modal, SafeAreaView, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Workout } from '../constants/types';

interface WorkoutEditProps {
  workout: Workout;
  isVisible: boolean;
  onSave: (updatedWorkout: Workout) => void;
  onCancel: () => void;
}

const WorkoutEdit: React.FC<WorkoutEditProps> = ({
  workout,
  isVisible,
  onSave,
  onCancel,
}) => {
  const [editableWorkout, setEditableWorkout] = React.useState<Workout>({
    ...workout,
    exercises: workout.exercises.map((ex) => ({ ...ex })),
  });

  const handleInputChange = (
    value: string,
    index: number,
    field: 'sets' | 'reps' | 'workout_name'
  ) => {
    if (field === 'workout_name') {
      // Directly update the workout name
      setEditableWorkout((prev) => ({
        ...prev,
        workout_name: value,
      }));
    } else {
      // Update sets or reps of a specific exercise
      let numericValue = parseInt(value, 10);
      if (isNaN(numericValue)) numericValue = 0;
  
      const updatedExercises = [...editableWorkout.exercises];
      updatedExercises[index] = {
        ...updatedExercises[index],
        [field]: numericValue,
      };
  
      setEditableWorkout((prev) => ({
        ...prev,
        exercises: updatedExercises,
      }));
    }
  };
  

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <SafeAreaView style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Edit your exercise program</Text>
          {/* Editable Workout Name */}
          <TextInput
            style={styles.workoutNameInput}
            value={editableWorkout.name}
            onChangeText={(text) => handleInputChange(text, 0, 'workout_name')} // Handle name change
            placeholder="Workout Name"
            placeholderTextColor="#bbb"
          />
          {/* Exercises List */}
          <FlatList
            data={editableWorkout.exercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <SafeAreaView style={styles.exerciseRow}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <TextInput
                  style={[styles.input, styles.inputSets]}
                  value={item.sets.toString()}
                  onChangeText={(text) =>
                    handleInputChange(text, index, 'sets')
                  }
                  placeholder="Sets"
                  placeholderTextColor="#bbb"
                />
                <TextInput
                  style={[styles.input, styles.inputReps]}
                  value={item.reps.toString()}
                  onChangeText={(text) =>
                    handleInputChange(text, index, 'reps')
                  }
                  placeholder="Reps"
                  placeholderTextColor="#bbb"
                />
              </SafeAreaView>
            )}
          />
          <SafeAreaView style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => onSave(editableWorkout)}
            >
              <Text style={styles.buttonText}>SAVE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.buttonText}>CANCEL</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#0B2346',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: {
    color: '#5C90E0',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  workoutNameInput: {
    backgroundColor: '#1A2F5D',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#1A2F5D',
    borderRadius: 10,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 16,
    flex: 2,
  },
  input: {
    backgroundColor: '#273C67',
    borderRadius: 8,
    padding: 8,
    color: '#fff',
    textAlign: 'center',
  },
  inputSets: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputReps: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#5C90E0',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#6D6D6D',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default WorkoutEdit;

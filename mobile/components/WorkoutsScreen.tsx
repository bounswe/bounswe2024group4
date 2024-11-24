import React from 'react';
import { SafeAreaView, FlatList, Text, Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Mock Data
const mockWorkoutPrograms = [
  {
    id: '1',
    name: 'Chest and Triceps',
    rating: '4.5',
    exercises: [
      {
        id: '1',
        image: require('../assets/images/chest.png'),
        name: 'Bench Press',
        sets: 4,
        reps: 10,
      },
      {
        id: '2',
        image: require('../assets/images/shoulder.png'),
        name: 'Dumbbell Flyes',
        sets: 3,
        reps: 12,
      },
    ],
  },
  {
    id: '2',
    name: 'Back and Biceps',
    rating: '4.8',
    exercises: [
      {
        id: '1',
        image: require('../assets/images/biceps.png'),
        name: 'Pull Ups',
        sets: 4,
        reps: 8,
      },
      {
        id: '2',
        image: require('../assets/images/back.png'),
        name: 'Deadlift',
        sets: 3,
        reps: 6,
      },
    ],
  },
];

const WorkoutList = () => {
  const handleShare = (programName: string) => {
    console.log(`Sharing workout: ${programName}`);
    alert(`Shared workout: ${programName}`);
  };

  const renderWorkoutProgram = ({ item }: { item: typeof mockWorkoutPrograms[0] }) => (
    <View style={styles.programContainer}>
      {/* Program Title */}
      <View style={styles.headerContainer}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.programTitle}>
          {item.name}
        </Text>
        <View style={styles.iconRow}>
          {/* Rating */}
          {item.rating && (
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={24} color="#FFD700" />
              <Text style={styles.ratingNumber}>{item.rating}</Text>
            </View>
          )}
          {/* Share Button */}
          <TouchableOpacity onPress={() => handleShare(item.name)}>
            <FontAwesome name="share" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Exercises */}
      {item.exercises.map((exercise, index) => (
        <React.Fragment key={exercise.id}>
          <View style={styles.exerciseRow}>
            <Image source={exercise.image} style={styles.exerciseImage} />
            <View style={styles.exerciseDetails}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseSetsReps}>
                {exercise.sets} sets x {exercise.reps} reps
              </Text>
            </View>
          </View>
          {/* Separator Line */}
          {index < item.exercises.length - 1 && <View style={styles.separatorLine} />}
        </React.Fragment>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={mockWorkoutPrograms}
        renderItem={renderWorkoutProgram}
        keyExtractor={(item) => item.id}
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
  },
});

export default WorkoutList;

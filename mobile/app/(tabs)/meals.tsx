import React from 'react';
import { FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MealProgram from '../../components/MealProgram';

const meals = [
  {
    id: '1',
    name: 'Breakfast',
    rating: '4.7',
    foods: [
      {
        id: '1',
        image: require('../../assets/images/grilled_chicken_salad.jpeg'),
        name: 'Grilled Chicken Salad',
        calories: 400,
        protein: '40g',
        carbs: '20g',
        fat: '10g',
      },
      {
        id: '2',
        image: require('../../assets/images/smoothie_bowl.jpeg'),
        name: 'Smoothie Bowl',
        calories: 350,
        protein: '20g',
        carbs: '40g',
        fat: '15g',
      },
    ],
  },
  {
    id: '2',
    name: 'Lunch',
    rating: '4.5',
    foods: [
      {
        id: '1',
        image: require('../../assets/images/avocado_toast.jpg'),
        name: 'Avocado Toast with Poached Egg',
        calories: 350,
        protein: '15g',
        carbs: '30g',
        fat: '20g',
      },
    ],
  },
];

export default function MealList() {
  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={meals}
        renderItem={({ item }) => <MealProgram meal={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.programList}
      />
      <Link href="../addMeal" asChild>
        <TouchableOpacity style={styles.addButton}>
          <FontAwesome5 name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1b1d21',
  },
  programList: {
    padding: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#AC1B80',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

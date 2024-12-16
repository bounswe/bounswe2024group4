import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Text, View } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MealProgram from '../../components/MealProgram';
import axios from 'axios';

interface Food {
  id: string;
  image: any;
  name: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: string[];
  recipeUrl: string;
  ca: string;
  cholesterol: string;
  fiber: string;
  k: string;
  na: string;
  vitARae: string;
  vitB6: string;
  vitB12: string;
  vitC: string;
  vitD: string;
  vitK: string;
}

interface Meal {
  id: string;
  name: string;
  rating: string;
  foods: Food[];
}

const MealList: React.FC = () => {
  const router = useRouter();
  const { viewingUser, viewedUser } = useGlobalSearchParams();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [changed, setChanged] = useState(false);

  const baseURL = 'http://' + process.env.EXPO_PUBLIC_API_URL + ':8000';

  // Fetch meals from backend
  const fetchUserMeals = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };
      const response = await axios.get(`${baseURL}/get_meals/`, config);
      if (response.status === 200) {
        setMeals(response.data.meals);
        setError(null);
      } else {
        setError('Failed to load meals.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again later.');
    }
  };

  // Delete a meal
  const deleteMeal = async (mealId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };
      const response = await axios.delete(`${baseURL}/meals/delete/${mealId}/`, config);
      if (response.status === 200) {
        setMeals(meals.filter((meal) => meal.id !== mealId));
        setChanged(!changed);
      } else {
        setError('Failed to delete meal.');
      }
    } catch (err) {
      console.error(err);
      setError('Error deleting meal. Please try again.');
    }
  };

  useEffect(() => {
    fetchUserMeals();
  }, [changed]);

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Meals</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {meals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No meals available.</Text>
        </View>
      ) : (
        <FlatList
          data={meals}
          renderItem={({ item }) => (
            <MealProgram meal={item} onDelete={() => deleteMeal(item.id)} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.programList}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          router.push({
            pathname: '../mealProgramCreator',
            params: { viewingUser, viewedUser },
          });
        }}
      >
        <FontAwesome5 name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1b1d21',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  programList: {
    padding: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: '#AC1B80',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MealList;

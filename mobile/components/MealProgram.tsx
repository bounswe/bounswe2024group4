import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Food from './Food';

interface FoodType {
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

interface MealProgramProps {
  meal: {
    id: string;
    name: string;
    foods: FoodType[];
    rating?: string;
  };
  onDelete: () => void;
}

const MealProgram: React.FC<MealProgramProps> = ({ meal, onDelete }) => {
  const handleShare = () => {
    console.log(`Sharing meal: ${meal.name}`);
    // Will be implemented later
  };

  return (
    <View style={styles.programContainer}>
      <View style={styles.headerContainer}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.programTitle}>
          {meal.name}
        </Text>
        {meal.rating && (
          <View style={styles.ratingContainer}>
            <FontAwesome5 name="star" size={18} color="#FFD700" />
            <Text style={styles.ratingText}>{meal.rating}</Text>
          </View>
        )}
      </View>

      {meal.foods.map((food) => (
        <Food
          key={food.id}
          foodName={food.name}
          calories={food.calories}
          protein={food.protein}
          carbs={food.carbs}
          fat={food.fat}
          ingredients={food.ingredients}
          imageUrl={food.image}
          recipeUrl={food.recipeUrl}
          ca={food.ca}
          cholesterol={food.cholesterol}
          fiber={food.fiber}
          k={food.k}
          na={food.na}
          vitARae={food.vitARae}
          vitB6={food.vitB6}
          vitB12={food.vitB12}
          vitC={food.vitC}
          vitD={food.vitD}
          vitK={food.vitK}
        />
      ))}

      <View style={styles.deleteButtonContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <FontAwesome5 name="trash-alt" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  programContainer: {
    backgroundColor: '#7953A9',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderColor: '#7953A9',
    borderWidth: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  programTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1,
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 14,
    marginLeft: 4,
  },
  deleteButtonContainer: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  deleteButton: {
    backgroundColor: '#AC1B80',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
});

export default MealProgram;

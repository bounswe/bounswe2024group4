import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Food {
  id: string;
  image: any;
  name: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

interface MealProgramProps {
  meal: {
    id: string;
    name: string;
    foods: Food[];
    rating?: string;
  };
}

const MealProgram: React.FC<MealProgramProps> = ({ meal }) => {
  
  const handleShare = () => {
    console.log(`Sharing meal: ${meal.name}`);
    // Will be implemented later
  };

  return (
    <View style={styles.programContainer}>
      <View style={styles.headerContainer}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.programTitle}>{meal.name}</Text>
        {meal.rating && (
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={handleShare}>
              <FontAwesome name="share" size={24} color="#fff" style={styles.icon} />
            </TouchableOpacity>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={24} color="#FFD700" />
              <Text style={styles.ratingNumber}>{meal.rating}</Text>
            </View>
          </View>
        )}
      </View>
      {meal.foods.map((food) => (
        <View key={food.id} style={styles.foodRow}>
          <Image source={food.image} style={styles.foodImage} />
          <View style={styles.foodDetails}>
            <Text style={styles.foodName}>{food.name}</Text>
            <Text style={styles.foodCalories}>Calories: {food.calories} cal</Text>
            <Text style={styles.foodNutrients}>
              Protein: {food.protein} | Carbs: {food.carbs} | Fat: {food.fat}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  programContainer: {
    backgroundColor: '#AC1B80',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: '#E05BAF',
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
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  foodImage: {
    width: 50,
    height: 50,
    marginRight: 20,
    marginLeft: 10,
    borderRadius: 5,
  },
  foodDetails: {
    flex: 1,
  },
  foodName: {
    color: '#fff',
    fontSize: 16,
  },
  foodCalories: {
    color: '#ccc',
    fontSize: 14,
  },
  foodNutrients: {
    color: '#bbb',
    fontSize: 14,
  },
});

export default MealProgram;

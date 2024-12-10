import React from 'react';
import { SafeAreaView, FlatList, Text, Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const mockMealPrograms = [
  {
    id: '1',
    name: 'Breakfast',
    rating: '4.7',
    foods: [
      {
        id: '1',
        image: require('../assets/images/grilled_chicken_salad.jpeg'),
        name: 'Grilled Chicken Salad',
        calories: 400,
        protein: '40g',
        carbs: '20g',
        fat: '10g',
      },
      {
        id: '2',
        image: require('../assets/images/smoothie_bowl.jpeg'),
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
        image: require('../assets/images/avocado_toast.jpg'),
        name: 'Avocado Toast with Poached Egg',
        calories: 350,
        protein: '15g',
        carbs: '30g',
        fat: '20g',
      },
    ],
  },
];

const MealList = () => {
  const handleShare = (mealName: string) => {
    console.log(`Sharing meal: ${mealName}`);
    alert(`Shared meal: ${mealName}`);
  };

  const renderMealProgram = ({ item }: { item: typeof mockMealPrograms[0] }) => (
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

      {/* Foods */}
      {item.foods.map((food, index) => (
        <React.Fragment key={food.id}>
          <View style={styles.foodRow}>
            <Image source={food.image} style={styles.foodImage} />
            <View style={styles.foodDetails}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodCalories}>Calories: {food.calories} cal</Text>
              <Text style={styles.foodNutrients}>
                Protein: {food.protein} | Carbs: {food.carbs} | Fat: {food.fat}
              </Text>
            </View>
          </View>
          {index < item.foods.length - 1 && <View style={styles.separatorLine} />}
        </React.Fragment>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={mockMealPrograms}
        renderItem={renderMealProgram}
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
  separatorLine: {
    height: 1,
    backgroundColor: '#E05BAF', 
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 1,
  },
});

export default MealList;

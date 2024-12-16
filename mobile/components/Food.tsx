import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface FoodProps {
  foodName: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: string[];
  imageUrl: any;
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

const Food: React.FC<FoodProps> = ({
  foodName,
  calories,
  protein,
  carbs,
  fat,
  fiber,
  cholesterol,
  ca,
  k,
  na,
  vitARae,
  vitB6,
  vitB12,
  vitC,
  vitD,
  vitK,
  imageUrl,
}) => {
  const [visibleSection, setVisibleSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setVisibleSection(visibleSection === section ? null : section);
  };

  return (
    <View style={styles.container}>
      <Image source={imageUrl} style={styles.image} />
      <Text style={styles.title}>{foodName}</Text>
      <Text style={styles.calories}>Calories: {calories}</Text>

      {/* Collapsible Sections */}
      <View style={styles.sectionsContainer}>
        {/* Macros */}
        <TouchableOpacity onPress={() => toggleSection('macros')}>
          <Text style={styles.sectionTitle}>Macros</Text>
        </TouchableOpacity>
        {visibleSection === 'macros' && (
          <View style={styles.content}>
            <Text style={styles.text}>Protein: {protein}</Text>
            <Text style={styles.text}>Carbs: {carbs}</Text>
            <Text style={styles.text}>Fat: {fat}</Text>
            <Text style={styles.text}>Fiber: {fiber}</Text>
          </View>
        )}

        {/* Micro Nutrients */}
        <TouchableOpacity onPress={() => toggleSection('micro')}>
          <Text style={styles.sectionTitle}>Micro Nutrients</Text>
        </TouchableOpacity>
        {visibleSection === 'micro' && (
          <View style={styles.content}>
            <Text style={styles.text}>Cholesterol: {cholesterol}</Text>
            <Text style={styles.text}>Potassium: {k}</Text>
            <Text style={styles.text}>Sodium: {na}</Text>
            <Text style={styles.text}>Calcium: {ca}</Text>
          </View>
        )}

        {/* Vitamins */}
        <TouchableOpacity onPress={() => toggleSection('vitamins')}>
          <Text style={styles.sectionTitle}>Vitamins</Text>
        </TouchableOpacity>
        {visibleSection === 'vitamins' && (
          <View style={styles.content}>
            <Text style={styles.text}>Vitamin A: {vitARae}</Text>
            <Text style={styles.text}>Vitamin B6: {vitB6}</Text>
            <Text style={styles.text}>Vitamin B12: {vitB12}</Text>
            <Text style={styles.text}>Vitamin C: {vitC}</Text>
            <Text style={styles.text}>Vitamin D: {vitD}</Text>
            <Text style={styles.text}>Vitamin K: {vitK}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#7953A9',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderColor: '#7953A9',
    borderWidth: 2,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9F9F9',
    textAlign: 'center',
    marginBottom: 5,
  },
  calories: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionsContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7953A9',
    paddingVertical: 8,
    textAlign: 'center',
    backgroundColor: '#EDE3F5',
    borderRadius: 5,
    marginVertical: 5,
  },
  content: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
  },
  text: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 2,
  },
});

export default Food;

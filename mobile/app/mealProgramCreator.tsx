import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import axios from 'axios';

const MealProgramCreator = () => {
  const router = useRouter();
  const { viewingUser, viewedUser } = useGlobalSearchParams();
  const [newFood, setNewFood] = useState(null);
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientAmount, setIngredientAmount] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const baseURL = 'http://' + process.env.EXPO_PUBLIC_API_URL + ':8000';

  useEffect(() => {
    const fetchFoods = async () => {
      try {
          const response = await axios.get(baseURL + "/get_foodname_options/", config);
          setFoods(response.data.food_list);
      } catch (err) {
          setError("Something went wrong. Please try again later.");
      }
    };
    fetchFoods();
  }, [baseURL]);

  const addIngredient = () => {
    if (ingredientName && ingredientAmount) {
      setIngredientsList([...ingredientsList, { name: ingredientName, amount: ingredientAmount }]);
      setIngredientName('');
      setIngredientAmount('');
      setError('');
    } else {
      setError('Please fill in both ingredient name and amount.');
    }
  };

  const removeIngredient = (ingredientName) => {
    setIngredientsList(ingredientsList.filter((ingredient) => ingredient.name !== ingredientName));
  };

  const handleSaveMeal = () => {
    // Logic for saving meal
    setSuccessMessage('Meal saved successfully!');
  };

  const handleFinalizeMeal = () => {
    // Logic for finalizing the meal
    setSuccessMessage('Meal finalized and saved!');
    router.push('/meals'); // Navigate back to meals page after finalizing
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Meal Program</Text>

      {newFood === null ? (
        <View>
          <Text style={styles.subHeader}>Add Ingredient</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={ingredientName}
              onChangeText={setIngredientName}
              placeholder="Ingredient name"
            />
            <TextInput
              style={styles.input}
              value={ingredientAmount}
              onChangeText={setIngredientAmount}
              placeholder="Amount (gr)"
            />
            <Button title="Add Ingredient" onPress={addIngredient} />
          </View>

          <Text style={styles.subHeader}>Added Ingredients</Text>
          <FlatList
            data={ingredientsList}
            renderItem={({ item }) => (
              <View style={styles.ingredientItem}>
                <Text>{item.name} ({item.amount} gr)</Text>
                <Button title="Remove" onPress={() => removeIngredient(item.name)} />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveMeal}>
            <Text style={styles.buttonText}>Save Food</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.finalizeButton} onPress={handleFinalizeMeal}>
            <Text style={styles.buttonText}>Finalize and Save Meal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => router.push('/meals')}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
          {error && <Text style={styles.errorMessage}>{error}</Text>}
        </View>
      ) : (
        <View>
          <Text style={styles.subHeader}>Ingredients List</Text>
          <FlatList
            data={ingredientsList}
            renderItem={({ item }) => (
              <View style={styles.ingredientItem}>
                <Text>{item.name} ({item.amount} gr)</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#2e2e2e',
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subHeader: {
    fontSize: 18,
    color: '#fff',
    marginTop: 16,
  },
  inputContainer: {
    marginTop: 16,
  },
  input: {
    backgroundColor: '#444',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    color: '#fff',
  },
  ingredientItem: {
    backgroundColor: '#444',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    marginTop: 16,
    borderRadius: 8,
  },
  finalizeButton: {
    backgroundColor: '#9c27b0',
    padding: 12,
    marginTop: 16,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 12,
    marginTop: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  successMessage: {
    color: 'green',
    marginTop: 16,
  },
  errorMessage: {
    color: 'red',
    marginTop: 16,
  },
});

export default MealProgramCreator;

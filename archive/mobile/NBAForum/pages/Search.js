import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Searchbar } from 'react-native-paper';
import axios from 'axios';
import { Context } from "../globalContext/globalContext.js";
import { useNavigation } from '@react-navigation/native';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { baseURL } = useContext(Context);
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a valid search query.");
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const encodedQuery = encodeURIComponent(searchQuery);
      const response = await axios.get(`${baseURL}/search/?query=${encodedQuery}`);
      setIsLoading(false);
      if (response.data) {
        console.log(response.data)
        navigation.navigate('SearchResults', { query: searchQuery, data: response.data });
      } else {
        setError("No data found for the query.");
      }
    } catch (err) {
      setError("Failed to fetch data");
      setIsLoading(false);
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search for a NBA team/player!"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#55A1E6',
  },
  error: {
    color: 'red',
    marginTop: 10,
    fontWeight: 'bold'
  }
});

export default Search;

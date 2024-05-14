import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Searchbar } from 'react-native-paper';
import axios from 'axios';
import { Context } from "../globalContext/globalContext.js";
import SearchResults from './SearchResults'; // Import SearchResults component

const Search = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null); // Store search results
  const [error, setError] = useState('');

  const { baseURL } = useContext(Context);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setError("Please enter a valid search query.");
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await axios.get(`${baseURL}/search/?query=${encodedQuery}`);
      setIsLoading(false);
      if (response.data && (response.data.player || response.data.team)) {
        setResults(response.data); // Store results in state
        console.log(results)
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
        onSubmitEditing={() => handleSearch(searchQuery)}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#FFFF" />
      ) : error ? (
        <Text>{error}</Text>
      ) : results ? (
        <SearchResults results={results} navigation={navigation} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    flex: 1,
    backgroundColor: '#55A1E6',
  },
});

export default Search;
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Searchbar } from 'react-native-paper';
import axios from 'axios';
import { Context } from "../globalContext/globalContext.js"; // Ensure the correct path

const Search = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      const data = response.data;
      setIsLoading(false);

      if (data.player) {

        // If player data is not null, navigate to the PlayerDetails screen
        navigation.navigate('Player', { player: data.player });
      } else if (data.team) {
        // If team data is not null, navigate to the TeamDetails screen
        navigation.navigate('Team', { team: data.team });
      } else {
        setError("No data found for the query.");
      }
      console.log("Player Data:", data.player);
      console.log("Player Data:", data.team);
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
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    flex: 1,
    backgroundColor: '#87CEEB',
  },
});

export default Search;

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const SearchResults = ({ results, navigation }) => {
  return (
    <View style={styles.resultsContainer}>
      {results.player && (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Player', { id: results.player.id })}>
          <Image source={{ uri: results.player.image }} style={styles.image} />
          <Text style={styles.name}>{results.player.name}</Text>
        </TouchableOpacity>
      )}
      {results.team && (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Team', { id: results.team.id })}>
          <Image source={{ uri: results.team.image }} style={styles.image} />
          <Text style={styles.name}>{results.team.name}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  resultsContainer: {
    padding: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccb',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  name: {
    fontSize: 18,
  },
});

export default SearchResults;
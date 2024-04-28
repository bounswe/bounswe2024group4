import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = query => setSearchQuery(query);


  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search for a NBA team/player!"
        onIconPress={onChangeSearch}
        value={searchQuery}
      />
      <View style={styles.blankSpace}></View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 25,
        flex: 1,
        backgroundColor: '#87CEEB',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        alignItems: 'center'
    },
    blankSpace: {
        height: 20, 
    },
});

export default Search
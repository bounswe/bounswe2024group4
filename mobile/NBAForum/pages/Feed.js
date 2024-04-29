import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Context } from "../globalContext/globalContext.js"

const Feed = () => {

  const globalContext = useContext(Context)
  const userObj = globalContext.userObj
  console.log("user object:", userObj)

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: 'blue' }]}>This is your feed!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignItems: 'center'
  },
});

export default Feed;
import React, { useState } from 'react';
import { SafeAreaView, View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Link, Stack } from 'expo-router';
import images from '../constants/image_map';

export default function Exercises() {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.background}>
        <Text style={styles.headerText}> Select a muscle group to train </Text>
        <View style={styles.cardContainer}>
          {Object.keys(images).map((muscleName, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, selectedImage === index ? styles.selectedCard : null]}
              onPress={() => setSelectedImage(index)}
            >
              <Image source={images[muscleName]} style={styles.cardImage} />
            </TouchableOpacity>
          ))}
        </View>
        <Link href={{pathname: "../exerciseSelector", params: {muscleName: Object.keys(images)[selectedImage]}}} asChild>
          <TouchableOpacity
            style={styles.proceedButton}
          >
            <Text style={styles.proceedButtonText}>Proceed</Text>
          </TouchableOpacity>
        </Link>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    backgroundColor: '#1b1d21',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'justify',
    marginTop: 10,
    marginBottom: 15,
    marginLeft: 35
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: '25%',
    height: 100,
    backgroundColor: '#16181A',
    borderWidth: 1,
    borderRadius: 8,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectedCard: {
    backgroundColor: '#202326',
    borderWidth: 2,
    borderColor: '#1B55AC',
  },
  proceedButton: {
    position: 'relative',
    top: 20,
    left: 255,
    width: 100,
    backgroundColor: '#1B55AC',
    borderRadius: 10,
    padding: 20,
  },
  proceedButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'justify',
  },
});
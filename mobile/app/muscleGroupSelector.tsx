import React, { useState } from 'react';
import { SafeAreaView, View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Stack } from 'expo-router';
import images from '../constants/image_map';
import { useRouter, useGlobalSearchParams } from 'expo-router';

export default function Exercises() {
  const [selectedImage, setSelectedImage] = useState(0);
  const { viewingUser, viewedUser } = useGlobalSearchParams();
  const router = useRouter();

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
              <Image 
                source={images[muscleName as keyof typeof images]}
                style={styles.cardImage} 
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              router.push({
                pathname: '../exercises',
                params: { viewingUser, viewedUser },
              });
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={() => {
              router.push({
                pathname: '../exerciseSelector',
                params: { muscleName: Object.keys(images)[selectedImage], viewingUser, viewedUser },
              });
            }}
          >
            <Text style={styles.proceedButtonText}>Proceed</Text>
          </TouchableOpacity>
        </View>
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
    marginLeft: 35,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  cancelButton: {
    width: 100,
    backgroundColor: '#FF4C4C',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  proceedButton: {
    width: 100,
    backgroundColor: '#1B55AC',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  proceedButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

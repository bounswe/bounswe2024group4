import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from "expo-router";

const HomeScreen: React.FC = () => {
  const router = useRouter();

  const handleLoginPress = () => {
    router.push("/login");
  };

  const handleSignupPress = () => {
    router.push("/signup");
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/Animation.json')}
        autoPlay
        loop
        style={styles.lottie}
      />

      <Text style={styles.title}>FITNESS AND DIET FORUM</Text>

      <Text style={styles.subtitle}>Welcome!</Text>

      <Text style={styles.buttonDescription}>Already have an account?</Text>
      <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.buttonDescription}>Sign up and join us!</Text>
      <TouchableOpacity style={styles.signupButton} onPress={handleSignupPress}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B55AC',
  },
  lottie: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#609FFF',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 30,
  },
  buttonDescription: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#609FFF',
    paddingVertical: 12,
    paddingHorizontal: 110,
    borderRadius: 25,
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#609FFF',
    paddingVertical: 12,
    paddingHorizontal: 110,
    borderRadius: 25,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;

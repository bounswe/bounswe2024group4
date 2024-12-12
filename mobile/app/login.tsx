import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import axios from 'axios';

const LoginScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const baseURL = 'http://' + process.env.EXPO_PUBLIC_API_URL + ':8000';

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in both username and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}/log_in/`, { username, password });
      console.log("Login successful:", response.data);
      
      Alert.alert("Success", "Login successful!");

      await AsyncStorage.setItem("username", username);
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("LoggedIn", "true");

      setLoading(false);
      router.push("/(tabs)");
    } catch (err) {
      setLoading(false);
      if (typeof err === "object" && err !== null && "response" in err) {
        const errorResponse = (err as { response?: { status?: number } }).response;
        
        Alert.alert(
          "Error",
          errorResponse?.status === 401
            ? "Invalid credentials. Please try again."
            : "An error occurred. Please try again."
        );
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };

  const handleForgotPassword = () => {
    Alert.alert("Info", "Forgot Password functionality is not implemented yet.");
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/Animation-dumbell.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <View style={styles.box}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Logging In..." : "Login"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 40, 
    marginTop: -50, 
  },
  box: {
    backgroundColor: '#0B2346',
    padding: 30, 
    borderRadius: 12,
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4, 
    width: '90%', 
    minHeight: 350, 
    marginTop: -100, 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B55AC',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
    height: 40,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
    height: 40,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 8,
  },
  loginButton: {
    backgroundColor: '#609FFF',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  forgotPassword: {
    color: '#609FFF',
    marginTop: 15,
    textAlign: 'center',
    textDecorationLine: 'underline', 
  },
});

export default LoginScreen;

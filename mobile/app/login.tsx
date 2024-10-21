import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Username:', username, 'Password:', password);
  };

  const handleForgotPassword = () => {
    console.log('Forgot Password pressed');
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
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#fff', 
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
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

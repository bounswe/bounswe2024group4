import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons'; 
import axios from 'axios';

const SignupScreen = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false);
  const baseURL = 'http://' + process.env.EXPO_PUBLIC_API_URL + ':8000';

  // Validation functions remain unchanged
  const validateUsername = (username: string): string => {
    if (!username) return 'Username is required.';
    const usernameRegex = /^[A-Za-z0-9_]+$/;
    if (!usernameRegex.test(username)) return 'Username can only contain letters, numbers, and underscores.';
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required.';
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address.';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required.';
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
    }
    return '';
  };

  const handleSignup = async (): Promise<void> => {
    const newErrors = {
      username: validateUsername(username),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: password !== confirmPassword ? 'Passwords do not match.' : '',
    };

    setErrors(newErrors);

    if (!newErrors.username && !newErrors.email && !newErrors.password && !newErrors.confirmPassword) {
      try {
        // Fetch CSRF Token (if applicable)
        const csrfResponse = await axios.get(`${baseURL}/csrf_token/`, { withCredentials: true });
        const csrfToken = csrfResponse.data.csrf_token;

        // Configure request headers
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        };

        // Post sign-up data
        const response = await axios.post(
          `${baseURL}/sign_up/`,
          {
            username,
            email,
            password,
            user_type: 'member', // Optional user_type field
          },
          config
        );

        await AsyncStorage.setItem('csrfToken', csrfResponse.data.csrf_token);
        console.log('Signup successful:', response.data);
        setSuccessModalVisible(true);
      } catch (err: any) {
        console.error('Signup failed:', err.response?.data || err.message);
        Alert.alert('Signup Error', err.response?.data?.message || 'Signup failed. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/Animation-healthy.json')} 
        autoPlay
        loop
        style={styles.lottie}
      />
      <View style={styles.box}>
        <Text style={styles.title}>Sign Up</Text>

        {/* Username Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#888"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setErrors({ ...errors, username: '' });
            }}
            autoCapitalize="none"
          />
        </View>
        {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}

        {/* Email Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors({ ...errors, email: '' });
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        {/* Password Field */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors({ ...errors, password: '' });
            }}
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
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        {/* Confirm Password Field */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setErrors({ ...errors, confirmPassword: '' });
            }}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

        {/* Signup Button */}
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal
        visible={successModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Signup Successful!</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setSuccessModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 70, 
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
  errorText: {
    color: '#FFA726', 
    fontSize: 12,
    marginBottom: 10,
  },
  signupButton: {
    backgroundColor: '#609FFF',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1B55AC',
  },
  modalButton: {
    backgroundColor: '#1B55AC',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SignupScreen;

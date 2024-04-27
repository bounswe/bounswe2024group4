import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import axios from 'axios'

const SignUp = () => {
  const baseURL = 'http://192.168.0.135:8000';
  //const baseURL = 'http://127.0.0.1:8000'
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const validateEmail = (emailAddress) => {
    console.log(emailAddress);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    return reg.test(emailAddress)
  }

  const validateUsername = (username) => {
    if (username == '')
      return false;
    let reg = /^[A-Za-z0-9_]*$/;
    return reg.test(username)
  }

  const validatePassword = (password, confirmPassword) => {
    if (password == '')
      return false;
    let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return reg.test(password)
  }

  const handleSignUp = async () => {
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);

    let errorMessage = ''
    if (password != confirmPassword) {
      errorMessage = 'Please make sure you enter the same password.';
    }else if (!validatePassword(password)) {
      errorMessage = 'Please enter a valid password that contains at least 8 characters, including at least 1 number, 1 special character, 1 uppercase and 1 lowercase letter.';
    }else if (!validateEmail(email)) {
      errorMessage = 'Please enter a valid email address.';
    }else if (!validateUsername(username)) {
      errorMessage = 'Please enter a username that only contains upper or lowercase letters, numbers and/or underscore'
    }
    if (errorMessage != '') {
      setMessage(errorMessage);
      toggleModal();
      return;
    }
    var formData = new FormData();
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('confirm_password', confirmPassword)

    try {
      const csrfToken = (await axios.get(baseURL + '/csrf_token/')).data.csrf_token;

      const response = await axios.post(
        baseURL + '/signup/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': csrfToken
          }
        }
      );
      if (response.status == 200) {
        setMessage('Sign-up successful! Welcome to our app.');
        toggleModal();
      } else {
        setMessage('Something went wrong, please try again.');
        toggleModal();
      }
    }
    catch (error) {
      console.log(error.message)
      setMessage('Something went wrong, please try again.');
      toggleModal();
    }
  };

  return (

    <View style={styles.container}>
      <Text style={[styles.title, { color: 'blue' }]}>Welcome to NBA Forum!</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={toggleModal}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
              <Text>{message}</Text>
              <Button title="Close" onPress={toggleModal} />
            </View>
          </View>
        </Modal>
      </View>
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
  },
  formContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  signUpButton: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SignUp;

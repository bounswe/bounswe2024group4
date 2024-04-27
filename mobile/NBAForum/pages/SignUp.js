import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import axios from 'axios'

const SignUp = () => {
  const baseURL = 'http://your-ip-address-for-now:8000';
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

  const handleSignUp = async () => {
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    if(validateEmail(email) == false){
      setMessage('Please enter a valid email address :(');
      toggleModal();
      return;
    }
    var formData = new FormData();
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('confirm_password', confirmPassword)

    try{
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
      if(response.status == 200){
        setMessage('Sign-up successful! Welcome to our app.');
        toggleModal();
      }else{
        setMessage('Sign-up not successful, please try again.');
        toggleModal();
      }
    }
    catch (error) {
      console.log(error.message)
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

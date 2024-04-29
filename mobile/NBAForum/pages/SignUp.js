import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import axios from 'axios'
import { Context } from "../globalContext/globalContext.js"


const SignUp = () => {
  const globalContext = useContext(Context)
  const { setIsLoggedIn, baseURL, setUserObj, setHasSession } = globalContext;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const validateEmail = (emailAddress) => {
    console.log(emailAddress);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    return reg.test(emailAddress);
  };

  const validateUsername = (username) => {
    if (username == "") return false;
    let reg = /^[A-Za-z0-9_]*$/;
    return reg.test(username);
  };

  const validatePassword = (password) => {
    if (password == '')
      return false;
    let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return reg.test(password)
  }

  const handleSignUp = async () => {
    axios.defaults.validateStatus = () => true;
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);

    let errorMessage = "";
    if (password != confirmPassword) {
      errorMessage = "Please make sure you enter the same password.";
    } else if (!validatePassword(password)) {
      errorMessage =
        "Please enter a valid password that contains at least 8 characters, including at least 1 number, 1 special character, 1 uppercase and 1 lowercase letter.";
    } else if (!validateEmail(email)) {
      errorMessage = "Please enter a valid email address.";
    } else if (!validateUsername(username)) {
      errorMessage =
        "Please enter a username that only contains upper or lowercase letters, numbers and/or underscore";
    }
    if (errorMessage != "") {
      setMessage(errorMessage);
      toggleModal();
      return;
    }
    var formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirm_password", confirmPassword);

    try {
      const csrfToken = (await axios.get(baseURL + "/csrf_token/")).data
        .csrf_token;

      const response = await axios.post(baseURL + "/signup/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrfToken,
        },
      });
      if (response.status == 200) {
        setMessage('Sign-up successful! Welcome to our app!');
        setHasSession(true);
        setUserObj(response.data);
        setIsLoggedIn(true);
      } else {
        setMessage(response.data);
        toggleModal();
      }
    }
    catch (error) {
      setMessage('Something went wrong, please try again.');
      toggleModal();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: "#232734" }]}>
        Create Your Account
      </Text>
      <Text style={[styles.subtitle, { color: "#63697D" }]}>
        Sign up to dive into the world of NBA!
      </Text>
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
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
              }}
            >
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
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#F9F9FB",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  formContainer: {
    width: "100%",
  },
  input: {
    fontSize: 16,
    width: "100%",
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    paddingLeft: 16,
  },
  signUpButton: {
    backgroundColor: "#1B64EB",
    fontSize: 18,
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    alignItems: "center",
  },
  signUpButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SignUp;

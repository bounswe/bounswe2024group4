import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
} from "react-native";
import axios from "axios";

const Login = () => {
  const baseURL = "http://your-ip-address-for-now:8000";
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleLogin = async () => {
    console.log("Username:", username);
    console.log("Password:", password);

    var formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const csrfToken = (await axios.get(baseURL + "/csrf_token/")).data
        .csrf_token;

      const response = await axios.post(baseURL + "/login/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrfToken,
        },
      });
      if (response.status == 200) {
        setMessage("Login successful!");
        toggleModal();
      } else {
        setMessage("Something went wrong, please try again.");
        toggleModal();
      }
    } catch (error) {
      console.log(error.message);
      setMessage("Something went wrong, please try again.");
      toggleModal();
    }
  };
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: "#232734" }]}>
        Login Your Account
      </Text>
      <Text style={[styles.subtitle, { color: "#63697D" }]}>
        Sign in to save and edit projects
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
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Sign In</Text>
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
  loginButton: {
    backgroundColor: "#1B64EB",
    fontSize: 18,
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Login;

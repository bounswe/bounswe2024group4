import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Context } from "../globalContext/globalContext.js";

const EditProfile = ({ navigation }) => {
  const { baseURL } = useContext(Context);
  const [selectedImage, setSelectedImage] = useState("");

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    bio: "",
    profilePicture: "",
    password: "",  
    confirmPassword: "" 
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${baseURL}/profile_view_edit_auth`);
        if (response.data) {
          setUserInfo({
            username: response.data.username,
            email: response.data.email,
            bio: response.data.bio,
            profilePicture: response.data.profile_picture ? `${baseURL}${response.data.profile_picture}` : userInfo.profilePicture,
            password: "", 
            confirmPassword: "" 
          });
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        Alert.alert('Error', 'Could not fetch profile data');
      }
      
    };

    fetchProfile();
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (userInfo.password !== userInfo.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const formData = new FormData();
    formData.append('username', userInfo.username);
    formData.append('email', userInfo.email);
    formData.append('bio', userInfo.bio);
    formData.append('password', userInfo.password); 

    // Check if the profile picture is a new file and not just a URL from the server
    if (userInfo.profilePicture && !userInfo.profilePicture.includes(baseURL)) {
      formData.append('profile_picture', {
        name: 'profile.jpg',
        type: 'image/jpeg',
        uri: selectedImage,
      });
    }

    try {
      const csrfToken = (await axios.get(baseURL + "/csrf_token/")).data.csrf_token;

      const response = await axios.post(`${baseURL}/profile_view_edit_auth`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrfToken,
        },
      });

      if (response.status === 200) {
        Alert.alert("Profile Updated", "Your profile has been successfully updated.");
        if (userInfo.password) {
          await handleLogout();
        }
        navigation.navigate('Profile');
      } else if (response.data.error) {
        Alert.alert('Update Failed', response.data.error);
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Update Failed', 'Failed to update profile.');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${baseURL}/log_out`);
      if (response.status === 200) {
        Alert.alert('Logged Out', 'You have been logged out. Please log in again.');
        navigation.navigate('Login');
      } else {
        throw new Error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Logout Failed', 'Failed to log out.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: userInfo.profilePicture }} style={styles.profileImage} />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        value={userInfo.username}
        onChangeText={username => setUserInfo({ ...userInfo, username })}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        value={userInfo.email}
        onChangeText={email => setUserInfo({ ...userInfo, email })}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        value={userInfo.bio}
        onChangeText={bio => setUserInfo({ ...userInfo, bio })}
        placeholder="Bio"
        multiline
      />
      <TextInput
        style={styles.input}
        value={userInfo.password}
        onChangeText={password => setUserInfo({ ...userInfo, password })}
        placeholder="New Password"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        value={userInfo.confirmPassword}
        onChangeText={confirmPassword => setUserInfo({ ...userInfo, confirmPassword })}
        placeholder="Confirm New Password"
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F9FF'
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '100%'
  },
  button: {
    backgroundColor: '#1B64EB',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
});

export default EditProfile;

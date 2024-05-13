import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import { Context } from "../globalContext/globalContext.js";

const EditProfile = ({ navigation }) => {
  const { baseURL, currentUser } = useContext(Context);  
  const [userInfo, setUserInfo] = useState({
    username: currentUser?.username || "",
    bio: currentUser?.bio || "",
    email: currentUser?.email || "",
    profilePicture: currentUser?.profile_picture || "https://cdn.nba.com/manage/2020/10/NBA20Primary20Logo-1-259x588.jpg"
  });

  const handleChoosePhoto = () => {
    const options = {
      noData: true,
      mediaType: 'photo',
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        setUserInfo({ ...userInfo, profilePicture: response.uri });
      }
    });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('username', userInfo.username);
      formData.append('email', userInfo.email);
      formData.append('bio', userInfo.bio);
      if (!userInfo.profilePicture.startsWith('http')) {
        formData.append('profile_picture', {
          name: 'profile.jpg',
          type: 'image/jpeg',
          uri: userInfo.profilePicture
        });
      }
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await axios.post(`${baseURL}/profile_view_edit/${currentUser.user_id}`, formData, config);
      console.log("Profile update response:", response.data);
      Alert.alert("Profile Updated Successfully!");
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: userInfo.profilePicture }} style={styles.profileImage} />
        </View>
        <Text style={styles.name}>{userInfo.username}</Text>
        <Text>{userInfo.email}</Text>
        <Text>{userInfo.bio}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
        <Text style={styles.buttonText}>Choose New Photo</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userInfo.username}
          onChangeText={(text) => setUserInfo({ ...userInfo, username: text })}
          placeholder="Username"
        />
        <TextInput
          style={styles.input}
          value={userInfo.email}
          onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
          placeholder="Email"
        />
        <TextInput
          style={styles.input}
          value={userInfo.bio}
          onChangeText={(text) => setUserInfo({ ...userInfo, bio: text })}
          placeholder="Biography"
          multiline
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F0F9FF'
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 60,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', 
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EditProfile;

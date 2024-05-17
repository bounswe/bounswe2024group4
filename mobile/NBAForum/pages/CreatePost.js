import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { Context } from "../globalContext/globalContext.js";

const CreatePostScreen = ({ setShowCreatePostModal }) => {
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const showAlert = (title, message, onPress) =>
    Alert.alert(title, message, [
      { text: "OK", onPress: onPress },
    ]);

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    };

  const share = async () => {
    console.log("Content:", description);
    console.log("Image:", selectedImage);

    var formData = new FormData();
    formData.append("content", description);
    formData.append("image", selectedImage);

    try {
      const csrfToken = (await axios.get(baseURL + "/csrf_token/")).data
        .csrf_token;
      const response = await axios.post(baseURL + "/post/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrfToken,
        },
      });
      
      if (response.status == 201) {
        showAlert("Success", "Post created successfully!", () => {
          setShowCreatePostModal(false);
        });
      } else {
        showAlert("Error", "Something went wrong, please try again.");
      }
    } catch (error) {
      console.log(error.message);
      showAlert("Error", "Something went wrong, please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24 }}>Create a New Post</Text>
      <TextInput
        style={styles.descriptionInput}
        onChangeText={(text) => setDescription(text)}
        value={description}
        placeholder="Enter post description"
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.addButton} onPress={pickImage}>
        <Text style={styles.addButtonText}>Add Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.shareButton} onPress={share}>
        <Text style={styles.shareButtonText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    padding: 24,
    borderRadius: 24,
    borderColor: "gray",
    borderWidth: 1,
  },
  descriptionInput: {
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    height: "auto",
    minHeight: 300,
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
  addButton: {
    fontSize: 18,
    padding: 12,
    marginTop: 16,
    alignItems: "center",
  },
  addButtonText: {
    color: "#1B64EB",
    fontSize: 16,
  },
  shareButton: {
    backgroundColor: "#1B64EB",
    fontSize: 18,
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    alignItems: "center",
  },
  shareButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CreatePostScreen;

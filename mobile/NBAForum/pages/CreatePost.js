import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import axios, { Axios } from "axios";
import { Context } from "../globalContext/globalContext.js";

const CreatePostScreen = ({ setShowCreatePostModal }) => {
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState("");

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const openImagePicker = () => {
    const options = {
      mediaType: "photo",
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("Image picker error: ", response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
      }
    });
  };

  const share = async () => {
    console.log("Content:", description);
    console.log("Image:", selectedImage);

    try {
      const response = await axios.post(
        baseURL + "/post",
        {
          content: description,
          image: selectedImage,
        },
      );
      console.log(response.data);
      if (response.status == 200) {
        setMessage("Post created successfully!");
        setShowCreatePostModal(false);
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
      <Text style={{ fontSize: 24 }}>Create a New Post</Text>
      <TextInput
        style={styles.descriptionInput}
        onChangeText={(text) => setDescription(text)}
        value={description}
        placeholder="Enter post description"
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.addButton} onPress={openImagePicker}>
        <Text style={styles.addButtonText}>Add Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.shareButton} onPress={share}>
        <Text style={styles.shareButtonText}>Share</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    padding: 24,
    borderRadius: 24,
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

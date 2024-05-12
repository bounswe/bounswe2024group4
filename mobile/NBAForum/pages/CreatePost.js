import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const CreatePostScreen = () => {
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  return (
    <View
      style={styles.container}
    >
      <Text style={{ fontSize: 24 }}>Create a New Post</Text>
      <TextInput
        style={styles.descriptionInput}
        onChangeText={(text) => setDescription(text)}
        value={description}
        placeholder="Enter post description"
        multiline
        numberOfLines={4}
      />
      <TextInput
        style={styles.linkInput}
        onChangeText={(text) => setLink(text)}
        value={link}
        placeholder="Enter a link"
      />
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.shareButton}>
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
    padding: 24
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
  linkInput: {
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    height: 40,
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

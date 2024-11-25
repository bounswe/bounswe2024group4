import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const EditProfileScreen = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    username: "John Doe",
    email: "john.doe@example.com",
    bio: "Fitness enthusiast, meal prep lover, and personal trainer. Let’s stay active!",
    profilePicture:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/%E9%98%BF%E7%88%BE%E9%81%94%C2%B7%E5%B1%85%E5%8B%92%E7%88%BE2024%E6%AD%90%E6%B4%B2%E7%9B%83%E9%A6%96%E5%A0%B4%E5%B0%8F%E7%B5%84%E8%B3%BD%E9%A6%96%E7%99%BC-2024.jpg/400px-%E9%98%BF%E7%88%BE%E9%81%94%C2%B7%E5%B1%85%E5%8B%92%E7%88%BE2024%E6%AD%90%E6%B4%B2%E7%9B%83%E9%A6%96%E5%A0%B4%E5%B0%8F%E7%B5%84%E8%B3%BD%E9%A6%96%E7%99%BC-2024.jpg",
    weight: "70",
    height: "180",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    weight: "",
    height: "",
  });

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  const validateEmail = (email: string): string => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email) return "Email is required.";
    if (!emailRegex.test(email)) return "Invalid email format.";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "";
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return "Password must include uppercase, lowercase, number, and special character.";
    }
    return "";
  };

  const validateNumber = (value: string): string => {
    const numberRegex = /^[0-9]*$/;
    if (!value) return "This field is required.";
    if (!numberRegex.test(value)) return "Only numbers are allowed.";
    return "";
  };

  const handleSave = () => {
    const emailError = validateEmail(userInfo.email);
    const passwordError = userInfo.password
      ? validatePassword(userInfo.password)
      : "";
    const confirmPasswordError =
      userInfo.password &&
      userInfo.password !== userInfo.confirmPassword
        ? "Passwords do not match."
        : "";
    const weightError = validateNumber(userInfo.weight);
    const heightError = validateNumber(userInfo.height);

    const newErrors = {
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      weight: weightError,
      height: heightError,
    };

    setErrors(newErrors);

    if (!emailError && !passwordError && !confirmPasswordError && !weightError && !heightError) {
      setSuccessModalVisible(true);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required", "We need permission to access your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUserInfo((prev) => ({
        ...prev,
        profilePicture: result.assets[0].uri,
      }));
    }
  };

  const handleModalClose = () => {
    setSuccessModalVisible(false);
    router.push('/profile'); 
  };

  return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.header}>Edit Profile</Text>

          {/* Profile Picture */}
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={{ uri: userInfo.profilePicture }}
                style={styles.profilePicture}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Username */}
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Username" // Placeholder eklendi
            value={userInfo.username}
            onChangeText={(text) => handleInputChange("username", text)}
          />

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email" // Placeholder eklendi
            value={userInfo.email}
            keyboardType="email-address"
            onChangeText={(text) => handleInputChange("email", text)}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          {/* Bio */}
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Bio" // Placeholder eklendi
            value={userInfo.bio}
            multiline
            numberOfLines={3}
            onChangeText={(text) => handleInputChange("bio", text)}
          />

          {/* Weight */}
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Weight (kg)" // Placeholder eklendi
            value={userInfo.weight}
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange("weight", text)}
          />
          {errors.weight ? <Text style={styles.errorText}>{errors.weight}</Text> : null}

          {/* Height */}
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="Height (cm)" // Placeholder eklendi
            value={userInfo.height}
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange("height", text)}
          />
          {errors.height ? <Text style={styles.errorText}>{errors.height}</Text> : null}

          {/* Password */}
          <Text style={styles.label}>New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter new password" // Placeholder eklendi
              value={userInfo.password}
              secureTextEntry={!showPassword}
              onChangeText={(text) => handleInputChange("password", text)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#888"
              />
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm new password" // Placeholder eklendi
              value={userInfo.confirmPassword}
              secureTextEntry={!showConfirmPassword}
              onChangeText={(text) => handleInputChange("confirmPassword", text)}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={24}
                color="#888"
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          {/* Success Modal */}
          <Modal
            visible={successModalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={handleModalClose}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
                </View>
                <Text style={styles.modalText}>Profile Updated Successfully!</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleModalClose}
                >
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1B55AC",
  },
  container: {
    backgroundColor: "#0B2346",
    padding: 20,
    borderRadius: 12,
    width: "95%",
    elevation: 5,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#609FFF",
    marginBottom: 20,
    textAlign: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#609FFF",
  },
  changePhotoText: {
    color: "#609FFF",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 8,
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#609FFF",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  iconContainer: {
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    width: 100,
    height: 100,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B55AC",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#609FFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditProfileScreen;

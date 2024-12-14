import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";

const EditProfileScreen = () => {
  const router = useRouter();
  const baseURL = `http://${process.env.EXPO_PUBLIC_API_URL}:8000`;

  const [userInfo, setUserInfo] = useState<{
    username: string;
    email: string;
    bio: string;
    profilePicture: string | null;
    weight: string;
    height: string;
    password: string;
    confirmPassword: string;
  }>({
    username: "",
    email: "",
    bio: "",
    profilePicture: null,
    weight: "",
    height: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<typeof userInfo>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: keyof typeof userInfo, value: string): void => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  const validateFields = () => {
    const newErrors: Partial<typeof userInfo> = {};

    if (userInfo.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userInfo.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (userInfo.password && userInfo.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    if (userInfo.password !== userInfo.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (userInfo.weight && isNaN(Number(userInfo.weight))) {
      newErrors.weight = "Weight must be a number.";
    }

    if (userInfo.height && isNaN(Number(userInfo.height))) {
      newErrors.height = "Height must be a number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

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
      setUserInfo((prev) => ({ ...prev, profilePicture: result.assets[0].uri }));
    }
  };

  const handleSave = async () => {
    if (!validateFields()) {
      return;
    }

    setIsSubmitting(true);
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      Alert.alert("Error", "You are not authenticated.");
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(userInfo).forEach((key) => {
      const value = userInfo[key as keyof typeof userInfo];
      if (value) {
        if (key === "profilePicture") {
          formDataToSend.append(key, {
            uri: value,
            type: "image/jpeg",
            name: "profile_picture.jpg",
          } as any);
        } else {
          formDataToSend.append(key, value);
        }
      }
    });

    try {
      const config = {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await axios.post(`${baseURL}/edit_profile/`, formDataToSend, config);

      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully!");
        router.push("/profile");
      }
    } catch (error: any) {
      console.error("Profile update failed:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Edit Profile</Text>

        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              style={styles.profilePicture}
              source={{ uri: userInfo.profilePicture || "https://via.placeholder.com/150" }}
            />
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </View>

        {/* Username */}
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={userInfo.username}
          onChangeText={(value) => handleInputChange("username", value)}
        />
        {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={userInfo.email}
          onChangeText={(value) => handleInputChange("email", value)}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Bio */}
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.input}
          placeholder="Bio"
          value={userInfo.bio}
          onChangeText={(value) => handleInputChange("bio", value)}
        />

        {/* Weight */}
        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          value={userInfo.weight}
          keyboardType="numeric"
          onChangeText={(value) => handleInputChange("weight", value)}
        />
        {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}

        {/* Height */}
        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          style={styles.input}
          placeholder="Height (cm)"
          value={userInfo.height}
          keyboardType="numeric"
          onChangeText={(value) => handleInputChange("height", value)}
        />
        {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter new password"
            secureTextEntry={!showPassword}
            value={userInfo.password}
            onChangeText={(value) => handleInputChange("password", value)}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#609FFF" />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm new password"
            secureTextEntry={!showConfirmPassword}
            value={userInfo.confirmPassword}
            onChangeText={(value) => handleInputChange("confirmPassword", value)}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#609FFF" />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSubmitting}>
          <Text style={styles.saveButtonText}>{isSubmitting ? "Saving..." : "Save Changes"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { 
    flexGrow: 1, 
    alignItems: "center", 
    backgroundColor: "#1B2B4C" 
  },
  container: { 
    padding: 20, 
    backgroundColor: "#081C39", 
    borderRadius: 15, 
    width: "95%" 
  },
  header: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center", 
    color: "#fff" 
  },
  profilePictureContainer: { 
    alignItems: "center", 
    marginBottom: 20 
  },
  profilePicture: { 
    width: 150, 
    height: 150, 
    borderRadius: 75, 
    borderWidth: 2, 
    borderColor: "#609FFF" 
  },
  changePhotoText: { 
    color: "#609FFF", 
    fontSize: 14, 
    textAlign: "center", 
    marginTop: 10 
  },
  label: { 
    color: "#fff", 
    marginBottom: 8, 
    fontSize: 16 
  },
  input: { 
    backgroundColor: "#fff", 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 16 
  },
  passwordContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#fff", 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 16 
  },
  passwordInput: { 
    flex: 1 
  },
  saveButton: { 
    backgroundColor: "#609FFF", 
    paddingVertical: 15, 
    borderRadius: 8, 
    alignItems: "center" 
  },
  saveButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  errorText: { 
    color: "red", 
    fontSize: 12, 
    marginBottom: 5 
  },
});


export default EditProfileScreen;

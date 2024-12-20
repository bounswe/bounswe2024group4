import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Context } from "./globalContext/globalContext.js";
import {
  HomePage,
  Login,
  SignUp,
  Feed,
  Post,
  Profile,
  EditProfile,
  OthersProfile,
  BookmarkedPosts,
} from "./pages";
import { Button } from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage'

const Stack = createNativeStackNavigator();

function Navigator() {
  const globalContext = useContext(Context);
  const { isLoggedIn, setIsLoggedIn, hasSession, baseURL } = globalContext;

  const handleLogout = async () => {
    try {
      const response = await axios.get(baseURL + "/log_out/");
      setIsLoggedIn(false);
      await AsyncStorage.setItem(
        'username',
        '',
      );
      await AsyncStorage.setItem(
        'loggedIn',
        'false',
      );

    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Stack.Navigator>
      {!isLoggedIn && !hasSession ? (
        <>
          <Stack.Screen
            name="HomePage"
            component={HomePage}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Feed"
            component={Feed}
            options={({ navigation }) => ({
              headerLeft: () => (
                <Button
                  onPress={() => navigation.navigate("BookmarkedPosts")}
                  title="Bookmarks"
                />
              ),
              headerRight: () => (
                <Button onPress={handleLogout} title="Log Out" />
              ),
            })}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              title: "Your Profile",
            }}
          />
          <Stack.Screen
            name="OthersProfile"
            component={OthersProfile}
            options={{
              title: "Profile Page",
            }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{
              title: "Edit Profile",
            }}
          />
          <Stack.Screen name="Post" component={Post} options={{}} />
          <Stack.Screen name="BookmarkedPosts" component={BookmarkedPosts} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default Navigator;

import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, View, Text, StyleSheet, Modal, Alert } from "react-native";
import { Provider } from "./globalContext/globalContext.js";
import Navigator from "./navigator.js";
import CommonNavigator from "./commonNavigator.js";
import CreatePost from "./pages/CreatePost.js";
import Profile from './pages/Profile.js';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const Tab = createBottomTabNavigator();
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  return (
    <Provider>
      <NavigationContainer>
        <Tab.Navigator tabBar={props => <CustomTabBar {...props} setShowCreatePostModal={setShowCreatePostModal} />}>
          <Tab.Screen name="Main" component={Navigator} options={{ headerShown: false }} />
          <Tab.Screen name="Search" component={CommonNavigator} />
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
        <Modal
          visible={showCreatePostModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => setShowCreatePostModal(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <CreatePost setShowCreatePostModal={setShowCreatePostModal}/>
          </View>
        </Modal>
      </NavigationContainer>
    </Provider>
  );
}

const showAlert = (title, message, onPress) =>
  Alert.alert(title, message, [
    { text: "OK", onPress: onPress },
  ]);

const CustomTabBar = ({ state, descriptors, navigation, setShowCreatePostModal }) => {
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={[styles.tabItem, { borderBottomWidth: isFocused ? 2 : 0 }]}
          >
            <Text style={{ color: isFocused ? '#1B64EB' : 'black' }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        onPress={async () => 
          {
            const log = await AsyncStorage.getItem('loggedIn');
            if (log == 'true') {
              setShowCreatePostModal(true)
            } else {
              showAlert("Login Required", "Please login to create a post", () => {})
            }
          }          
        }
        style={styles.plusButton}
      >
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    height: 60,
    justifyContent: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1B64EB',
    bottom: 48,
    alignSelf: 'center',
    zIndex: 999,
  },
  plusButtonText: {
    color: 'white',
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: 54,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    position: 'absolute',
    top: 28,
    right: 20,
    zIndex: 999,
  },
  closeButtonText: {
    color: '#1B64EB',
    fontSize: 18,
  },
});

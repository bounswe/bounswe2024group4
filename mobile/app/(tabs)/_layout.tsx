import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        if (username) {
          setCurrentUser(username);
        }
      } catch (error) {
        console.error("Error fetching username from AsyncStorage:", error);
      }
    };

    fetchUsername();
  }, []);

  if (!currentUser) {
    return "";
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveBackgroundColor: "#1b1d21",
        tabBarActiveBackgroundColor: "#1b1d21",
        headerStyle: { backgroundColor: '#1B55AC' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={30} name="home" color={color} />,
        }}
        initialParams={{
          viewingUser: currentUser,
          viewedUser: currentUser
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          headerStyle: { backgroundColor: '#1B55AC' },
          tabBarIcon: ({ color }) => <FontAwesome6 size={28} name="dumbbell" color={color} />,
        }}
        initialParams={{
          viewingUser: currentUser,
          viewedUser: currentUser
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: 'Meals',
          headerStyle: { backgroundColor: '#C23894' },
          tabBarIcon: ({ color }) => <FontAwesome6 size={28} name="bowl-food" color={color} />,
        }}
        initialParams={{
          viewingUser: currentUser,
          viewedUser: currentUser
        }}
      />
    
      
      <Tabs.Screen
        name="WeeklyProgram"
        options={{
          title: 'Weekly',
          tabBarIcon: ({ color }) => <FontAwesome6 size={28} name="calendar-week" color={color} />,
        }}
        initialParams={{
          viewingUser: currentUser,
          viewedUser: currentUser,
        }}
      />
     <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={28} name="globe" color={color} />
          )
        }}
        initialParams={{
          viewingUser: currentUser,
          viewedUser: currentUser,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          headerStyle: { backgroundColor: '#FFDD00' },
          tabBarIcon: ({ color }) => <FontAwesome6 size={28} name="ranking-star" color={color} />,
        }}
        initialParams={{
          viewingUser: currentUser,
          viewedUser: currentUser
        }}
      /><Tabs.Screen
      name="profile"
      options={{
        title: 'Profile',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
      }}
      initialParams={{
        viewingUser: currentUser,
        viewedUser: currentUser
      }}
    />
    </Tabs>
    
  );
}

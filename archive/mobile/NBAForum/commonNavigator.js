import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Team, Player, Search, Profile, SearchResults} from "./pages";


const Stack = createNativeStackNavigator();

function CommonNavigator() {

  return(
    <Stack.Navigator>
        <Stack.Screen
            name="Search sth"
            component={Search}
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen
            name="SearchResults"
            component={SearchResults}
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen
            name="Team"
            component={Team}
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen
            name="Player"
            component={Player}
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen 
            name="Profile" 
            component={Profile} 
            options={{ 
                title: 'Profile' 
            }} 
        />

    </Stack.Navigator>
  )
}


export default CommonNavigator;
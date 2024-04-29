import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Team, Player, Search } from "./pages";


const Stack = createNativeStackNavigator();

function CommonNavigator() {

  return(
    <Stack.Navigator>
        <Stack.Screen
            name="Search"
            component={Search}
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
    </Stack.Navigator>
  )
}


export default CommonNavigator;
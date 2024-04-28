import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from "./globalContext/globalContext.js";
import Navigator from './navigator.js'
import Player from './pages/Player.js';


export default function App() {
    const Tab = createBottomTabNavigator();

    return (
        <Provider>
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen name="Main" component={Navigator} options={{ headerShown: false }}/>
                    <Tab.Screen name="Players" component={Player} />
                </Tab.Navigator>
            </NavigationContainer>
        </Provider>
    );
}
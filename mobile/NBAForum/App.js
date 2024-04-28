import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from "./globalContext/globalContext.js";
import Navigator from './navigator.js'


export default function App() {

    return (
        <Provider>
            <NavigationContainer>
                <Navigator/>
            </NavigationContainer>
        </Provider>
    );
}
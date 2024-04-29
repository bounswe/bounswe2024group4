import React, {useContext} from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Context } from "./globalContext/globalContext.js"
import { HomePage, Login, SignUp, Feed } from "./pages";
import { Button } from 'react-native';
import axios from 'axios';


const Stack = createNativeStackNavigator();

function Navigator() {

    const globalContext = useContext(Context)
    const { isLoggedIn, setIsLoggedIn, hasSession, baseURL } = globalContext;

    const handleLogout = async () => {
        try {
          const response = await axios.get(baseURL + '/log_out/');
          setIsLoggedIn(false)
        }catch(error){
          console.log(error.message)
        }
    }

  return(
    <Stack.Navigator>
        {(!isLoggedIn && !hasSession)?
        <>
        <Stack.Screen
            name="HomePage"
            component={HomePage}
            options={{
                headerShown: false
            }}
        />

        <Stack.Screen
            name="Login"
            component={Login}
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{
                headerShown: false
            }}
        />
        </>
        :
        <>
        <Stack.Screen
            name="Feed"
            component={Feed}
            options={{
                headerRight: () => (
                    <Button
                        onPress={handleLogout}
                        title="Log Out"
                    />
                )
            }}
        />
        </>
    }
    </Stack.Navigator>

  )



}


export default Navigator;
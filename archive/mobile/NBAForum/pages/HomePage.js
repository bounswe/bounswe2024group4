import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomePage = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
            <Text style={[styles.title, { color: "#232734" }]}>
                Welcome to NBA Forum!
            </Text>
            <Text style={[styles.subtitle, { color: "#63697D" }]}>
                Let's get started!
            </Text>
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={[styles.subtitle, { color: "#63697D" }]}>
                Already have an account?
            </Text>
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#1B64EB",
        fontSize: 18,
        padding: 16,
        borderRadius: 16,
        marginTop: 10,
        alignSelf: "center",
        width: "50%",
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    formContainer: {
        width: "85%",
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 30,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 30,
    },
});

export default HomePage

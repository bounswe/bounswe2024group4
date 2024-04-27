import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import axios from 'axios'

const Login = () => {
    const baseURL = 'http://your-ip-address-for-now:8000';
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const handleLogin = async () => {
        console.log('Username:', username);
        console.log('Password:', password);

        var formData = new FormData();
        formData.append('username', username)
        formData.append('password', password)

        try {
            const csrfToken = (await axios.get(baseURL + '/csrf_token/')).data.csrf_token;

            const response = await axios.post(
                baseURL + '/login/',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRFToken': csrfToken
                    }
                }
            );
            if (response.status == 200) {
                setMessage('Login successful!');
                toggleModal();
            } else {
                setMessage('Something went wrong, please try again.');
                toggleModal();
            }
        }
        catch (error) {
            console.log(error.message)
            setMessage('Something went wrong, please try again.');
            toggleModal();
        }
    };
    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: 'blue' }]}>Welcome to NBA Forum!</Text>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent={false}
                    onRequestClose={toggleModal}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                            <Text>{message}</Text>
                            <Button title="Close" onPress={toggleModal} />
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    formContainer: {
        width: '100%',
    },
    input: {
        width: '100%',
        height: 40,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
    },
    loginButton: {
        backgroundColor: '#007aff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    loginButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Login

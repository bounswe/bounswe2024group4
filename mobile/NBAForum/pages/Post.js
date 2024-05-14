import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Post = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>post details</Text>
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
});

export default Post

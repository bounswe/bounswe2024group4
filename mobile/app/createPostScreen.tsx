import { Stack } from 'expo-router';
import CreatePost from '../components/PostCreate';

export default function CreatePostScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Post',
          headerStyle: {
            backgroundColor: '#1c1f26',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <CreatePost />
    </>
  );
}
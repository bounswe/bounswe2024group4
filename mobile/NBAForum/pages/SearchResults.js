import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Context } from '../globalContext/globalContext'; 
import { useNavigation, useRoute } from '@react-navigation/native';

const SearchResults = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { query } = route.params;
  const { baseURL } = useContext(Context);
  const [data, setData] = useState({ team: null, player: null, posts: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [query]);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`${baseURL}/search/?query=${encodeURIComponent(query)}`);
      if (response.data) {
        setData(response.data);
        if (response.data.team) {
          fetchTeamDetails(response.data.team.id);
        }
        if (response.data.player) {
          fetchPlayerDetails(response.data.player.id);
        }
      } else {
        setError('No results found');
      }
    } catch (error) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeamDetails = async (teamId) => {
    try {
      const teamResponse = await axios.get(`${baseURL}/team/?id=${teamId}`);
      setData(prevState => ({
        ...prevState,
        team: { ...prevState.team, ...teamResponse.data }
      }));
    } catch (error) {
      console.error('Error fetching team details:', error);
    }
  };

  const fetchPlayerDetails = async (playerId) => {
    try {
      const playerResponse = await axios.get(`${baseURL}/player/?id=${playerId}`);
      setData(prevState => ({
        ...prevState,
        player: { ...prevState.player, ...playerResponse.data }
      }));
    } catch (error) {
      console.error('Error fetching player details:', error);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <View style={styles.center}><Text>{error}</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Search Results for "{query}":</Text>
      {data.team && (
        <View>
          <Text style={styles.subheader}>Teams:</Text>
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Team', { id: data.team.id })}>
            <View style={styles.row}>
              <Image source={{ uri: data.team.image }} style={styles.image} />
              <Text style={styles.text}>{data.team.name}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {data.player && (
        <View>
          <Text style={styles.subheader}>Players:</Text>
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Player', { id: data.player.id })}>
            <View style={styles.row}>
              <Image source={{ uri: data.player.image }} style={styles.image} />
              <Text style={styles.text}>{data.player.name}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {data.posts && data.posts.length > 0 && (
        <View style={styles.postsContainer}>
          <Text style={styles.subheader}>Related Posts:</Text>
          {data.posts.map((post) => (
            <Text key={post.id} style={styles.postText}>{post.id}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#55A1E6'
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  subheader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  item: {
    marginBottom: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eaeaea',
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 10,
    resizeMode: 'contain'
  },
  text: {
    fontSize: 20
  },
  postsContainer: {
    marginTop: 20
  },
  postText: {
    marginTop: 5,
    fontSize: 16
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default SearchResults;

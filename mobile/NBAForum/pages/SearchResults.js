import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import Post from './Post.js';
import { Context } from '../globalContext/globalContext'; 
import { useNavigation, useRoute } from '@react-navigation/native';

const SearchResults = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { query } = route.params;
  const { baseURL } = useContext(Context);
  const [ data, setData ] = useState({ team: null, players: null, posts: [] });
  const [ isLoading, setIsLoading ] = useState(true);
  const [ error, setError ] = useState('');
  const [ postDetails, setPostDetails]  = useState([]);
  const [ teamDetails, setTeamDetails] = useState([]);
  const [ playerDetails, setPlayerDetails] = useState([]);

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
          fetchTeamDetails(response.data.team);
        }
        if (response.data.players) {
          fetchPlayerDetails(response.data.players);
        }
        if (response.data.posts) {
          fetchPostDetails(response.data.posts);
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

  const fetchTeamDetails = async (teams) => {
    try {
      const teamRequests = teams.map(team => axios.get(`${baseURL}/team/?id=${team[1]}`));
      const teamResponses = await Promise.all(teamRequests);
      const fetchedTeams = teamResponses.map(response => response.data);
      const fetchedTeamsWithIds = fetchedTeams.map((team, index) => ({
        ...team,
        id: teams[index][1], // Use the ID from the teams list
      }));
      setTeamDetails(fetchedTeamsWithIds);
    } catch (error) {
      console.error('Error fetching team details:', error);
    }
  };

  const fetchPlayerDetails = async (players) => {
    try {
      const playerRequests = players.map(player => axios.get(`${baseURL}/player/?id=${player[1]}`));
      const playerResponses = await Promise.all(playerRequests);
      const fetchedPlayers = playerResponses.map(response => response.data);
      const fetchedPlayersWithIds = fetchedPlayers.map((player, index) => ({
        ...player,
        id: players[index][1], // Use the ID from the teams list
      }));
      setPlayerDetails(fetchedPlayersWithIds);
      console.log('aaaaaaaaa', playerDetails);
    } catch (error) {
      console.error('Error fetching player details:', error);
    }
  };

  const fetchPostDetails = async (postIds) => {
    try {
      const postRequests = postIds.map(postId => axios.get(`${baseURL}/post_detail/${postId.id}/`));
      const postResponses = await Promise.all(postRequests);
      const fetchedPosts = postResponses.map(response => response.data);
      setPostDetails(fetchedPosts);

    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <View style={styles.center}><Text>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search Results for "{query}":</Text>
      {data.team && data.team.length > 0 && (
        <View style={{ flex: 1 }}>
          <Text style={styles.subheader}>Teams:</Text>
            {
              <FlatList
                data={teamDetails}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Team', { id: item.id })}>
                      <View style={styles.row}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <Text style={styles.text}>{item.name}</Text>
                      </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                />
              }
              
        </View>
      )}
      {data.players && data.players.length > 0 && (
        <View style={{ flex: 1 }}>
          <Text style={styles.subheader}>Players:</Text>
            {
              <FlatList
                data={playerDetails}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Player', { id: item.id })}>
                    <View style={styles.row}>
                      <Image source={{ uri: item.image }} style={styles.image} />
                      <View>
                        <Text style={styles.text}>{item.name}</Text>
                        <Text> {item.height ? item.height.substr(1,4) + "cm" :""} </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                />
            }
        </View>
      )}
      {data.posts && data.posts.length > 0 && (
        <View  style={{ flex: 1 }}>
        <Text style={styles.subheader}>Posts:</Text>
          {
          <FlatList
            data={postDetails}
            renderItem={({ item }) => (
              <Post
                post={item}
              />
            )}
            keyExtractor={(item) => item.post_id.toString()}
            />
          }
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#55A1E6',
    padding: 5,
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
    backgroundColor: '#ffffff',
    padding: 10,
    margin: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BCBCBC',
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 10,
    resizeMode: 'contain'
  },
  text: {
    fontSize: 20,
    marginBottom: 5
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

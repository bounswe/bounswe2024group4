import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import MapView from 'react-native-maps';
import axios from 'axios';


const Team = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [teams, setTeams] = useState([]);

  const onChangeSearch = query => setSearchQuery(query);

  const handleSearch = async (query) => {
    try {
      const baseURL = 'your-based-url';
      const searchPath = `/search/query=${query}`;

      const response = await axios.get(baseURL + searchPath);

      if (response.status === 200) {
        console.log('OK:', response.data);
        setTeams(response.data.teams);
      } else {
        console.log('FAİL', response.status);
      }
    } catch (error) {
      console.error('FAİL', error);
    }
  };

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]); 



  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        <View style={styles.blankSpace}></View>

        {/* Takım isimlerini burada görüntüle */}
        <View>
          {teams.map((team, index) => (
            <Text key={index}>{team.name}</Text>
          ))}
        </View>

        <View style={styles.team_nameContainer}>
          <Text style={[styles.heading, styles.team_nameHeading]}>Team Name</Text>
          </View>

        <View style={styles.teamInfoContainer}>
          <Text style={[styles.heading, styles.teamInfoHeading]}>Team Info</Text>
          <Image source={{ uri: 'https://example.com/player1.jpg' }} style={styles.TeamImage} />

            <View style={styles.playerInfo}>
              <Text>Conference: Eastern Conference</Text>
              <Text>Division: Atlantic Division</Text>
              <Text>Coach: John Doe</Text>
              <Text>Area: United States</Text>
            </View>

            <MapView
            style={{ flex: 1, height: 200 }}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
         
        </View>
        <View style={styles.playersContainer}>
          <Text style={styles.heading}>Players</Text>
          <View style={styles.playerItem}>
            <Image source={{ uri: 'https://example.com/player1.jpg' }} style={styles.playerImage} />
            <View style={styles.playerInfo}>
              <Text>Player 1 Surname 1</Text>
              <View style={styles.playerPosition}>
              <Text style={styles.positionText}>Forward</Text>
            </View>
            </View>
          </View>
          <View style={styles.playerItem}>
            <Image source={{ uri: 'https://example.com/player1.jpg' }} style={styles.playerImage} />
            <View style={styles.playerInfo}>
              <Text>Player 1 Surname 1</Text>
              <View style={styles.playerPosition}>
              <Text style={styles.positionText}>Forward</Text>
            </View>
            </View>
          </View>
          <View style={styles.playerItem}>
            <Image source={{ uri: 'https://example.com/player1.jpg' }} style={styles.playerImage} />
            <View style={styles.playerInfo}>
              <Text>Player 1 Surname 1</Text>
              <View style={styles.playerPosition}>
              <Text style={styles.positionText}>Forward</Text>
            </View>
            </View>
          </View>
          <View style={styles.playerItem}>
            <Image source={{ uri: 'https://example.com/player1.jpg' }} style={styles.playerImage} />
            <View style={styles.playerInfo}>
              <Text>Player 1 Surname 1</Text>
              <View style={styles.playerPosition}>
              <Text style={styles.positionText}>Forward</Text>
            </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    padding: 25,
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  teamInfoContainer: {
    marginBottom: 30,
    backgroundColor: '#eaeaea', 
    padding: 10,
    borderRadius: 10,
  },
  teamInfoHeading: {
    marginBottom: 10,
  },
  
  playersContainer: {
    marginBottom: 20,
    backgroundColor: '#eaeaea', 
    padding: 10,
    borderRadius: 10,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  playerImage: {
    width: 150,
    height: 150,
    borderRadius: 25,
    marginRight: 10,
  },
  playerPosition: {
    width: 60,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  TeamImage: {
    width: 150,
    height: 150,
    borderRadius: 25,
    marginRight: 10,
  },
  playerInfo: {
    flex: 1,
  },
  blankSpace: {
    height: 20, 
  },
});

export default Team;

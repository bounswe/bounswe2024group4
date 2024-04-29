import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { Context } from "../globalContext/globalContext.js"
import MapView from 'react-native-maps';
import axios from 'axios';


const Team = ({ route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [teams, setTeams] = useState([]);
  const { baseURL } = useContext(Context);

  const  teamID  =  route.params['id'];
  console.log(route.params['id'])
  const handleSearch = async (query) => {
    try {
      const response = await axios.get(`${baseURL}/team/?id=${query}`);

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
    handleSearch(teamID);
  }, [teamID]); 


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
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

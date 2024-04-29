import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { Context } from "../globalContext/globalContext.js"
import MapView from 'react-native-maps';
import axios from 'axios';


const Team = ({ route }) => {
  const { baseURL } = useContext(Context);
  const [teamInfo, setTeamInfo] = useState("LL");
  const  teamID  =  route.params['id'];
  console.log(route.params['id'])
  const handleSearch = async (query) => {
    try {
      const response = await axios.get(`${baseURL}/team/?id=${query}`);
      setTeamInfo(response.data);

      if (response.status === 200) {
        console.log('OK:', response.data);
      } else {
        console.log('FAIL', response.status);
      }
    } catch (error) {
      console.error('FAIL', error);
    }
  };

  useEffect(() => {
    handleSearch(teamID);
  }, [teamID]); 


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>

          <Text style={[styles.heading, styles.team_nameHeading]}>{teamInfo.name}</Text>

        <View style={styles.teamInfoContainer}>
          <Text style={[styles.heading, styles.teamInfoHeading]}>Team Info</Text>

            <View style={styles.playerInfo}>
              <Text>Conference: {teamInfo.conference}</Text>
              <Text>Division: {teamInfo.division}</Text>
              <Text>Coach: {teamInfo.coach}</Text>
              <Text>Area: United States</Text>
            </View>

          <Text style={[styles.heading, styles.teamInfoHeading]}>{teamInfo.venue}</Text>
            <MapView
            style={{ flex: 1, height: 200 }}
            initialRegion={{
              latitude: teamInfo.venue_latitude,
              longitude: teamInfo.venue_longitude,
              latitudeDelta: 0.0043,
              longitudeDelta: 0.0034,
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

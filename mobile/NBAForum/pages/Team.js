import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { Context } from "../globalContext/globalContext.js"
import MapView from 'react-native-maps';
import axios from 'axios';


const Team = ({ route }) => {
  const { baseURL } = useContext(Context);
  const [teamInfo, setTeamInfo] = useState("LL");
  const  teamID  =  route.params['id'];
  console.log(route.params['id'])
  const [ isLoading, setIsLoading ] = useState(true);
  
  const handleSearch = async (query) => {
    try {
      const response = await axios.get(`${baseURL}/team/?id=${query}`);
      setTeamInfo(response.data);
      setIsLoading(false);

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
  }, []); 


  return (
    (!isLoading)? (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.teamImageWrapper}>

              <Image src={teamInfo.image} style={{width: "100%", height: "100%"}} resizeMode='contain' />
         </View>
          <Text style={styles.heading}>{teamInfo.name}</Text>

        <View style={styles.teamInfoContainer}>
          <Text style={[styles.heading, styles.teamInfoHeading]}>Team Info</Text>

            <View style={styles.teamInfo}>
              <Text>Conference: {teamInfo.conference}</Text>
              <Text>Division: {teamInfo.division}</Text>
              <Text>Coach: {teamInfo.coach}</Text>
            </View>

          <Text style={[styles.heading, styles.teamInfoHeading]}>Venue: {teamInfo.venue}</Text>
            <MapView
            style={{ flex: 1, height: 200 }}
            initialRegion={{
              latitude: teamInfo.venue_latitude,
              longitude: teamInfo.venue_longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
         
        </View>
       
      </View>
    </ScrollView>
    )
    :(
      <View style={styles.container}>
      </View>
    )
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
    marginTop: 10,
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
  teamImageWrapper: {
    width: '40%',
    aspectRatio: 1, 
    borderRadius: 5,
    overflow: 'hidden',
    borderRadius: 16,
  },
  teamInfo: {
    flex: 1,
  },
});

export default Team;

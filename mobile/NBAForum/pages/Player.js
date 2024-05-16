import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Context } from "../globalContext/globalContext.js"
import axios from 'axios';

const Player = ({ route }) => {
  const { baseURL } = useContext(Context);
  const [ playerInfo, setPlayerInfo ] = useState("LL");
  const [ isLoading, setIsLoading ] = useState(true);
  const playerID = route.params['id'];
  console.log(playerID)

  const handleSearch = async (id) => {
    try {
      const response = await axios.get(`${baseURL}/player/?id=${id}`);
      setPlayerInfo(response.data);
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
    handleSearch(playerID);
  }, []);

  return (
    (!isLoading)? (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.heading}>{playerInfo.name}</Text>

      <View style={styles.frame}>
        <View style={styles.leftsideContainer}>
          <View style={styles.playerImageContainer}>
            <View style={styles.playerImageWrapper}>
              <Image src={playerInfo.image}  style={styles.playerImage} />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.sub1Heading}>Personal Information</Text>
              <View style={styles.personalInfoItem}>
                <Text style={styles.sub2Heading}>Height:</Text> 
                <Text>{playerInfo.height.substr(1,4)} cm</Text>
                <Text style={styles.sub2Heading}>Date of Birth:</Text> 
                <Text>{playerInfo.date_of_birth.substr(1,10)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.rightsideContainer}>

          <View style={styles.infoContainer}>
            <Text style={styles.sub1Heading}>Professional Career</Text>
            <View style={styles.careerItem}>
              <View style={styles.careerData}>
                <Text style={styles.sub2Heading}>Teams</Text>
                  {Object.keys(playerInfo.teams).map((team) => (
                    <Text key={team}>{'\u2022'} {team}</Text>
                  ))}
              </View>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.sub2Heading}>Positions</Text>
            <View style={styles.teamInfoItem}>
            {playerInfo.positions.map((position) => (
                    <Text key={position}>{'\u2022'} {position}</Text>
                  ))}
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.sub2Heading}>Awards</Text>
            <View style={styles.teamInfoItem}>
                  {Object.keys(playerInfo.awards).map((award) => (
                    <Text key={award}>{'\u2022'} {award}</Text>
                  ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
    )
    :(
      <View style={styles.scrollContainer}>
        <ActivityIndicator size="large" color="#FFFF" />
      </View>
    )
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    padding: 10,
    marginBottom: 5,
    marginTop: 5,
  },
  frame: {
    flexDirection: 'row',
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#55A1E6",
  },
  leftsideContainer: {
    flex: 1,
    backgroundColor: '#eaeaea', 
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  rightsideContainer: {
    flex: 1,
    backgroundColor: '#eaeaea', 
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  playerImageContainer: {
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 16,
  },
  playerImageWrapper: {
    width: '100%',
    aspectRatio: 1, 
    borderRadius: 10,
    overflow: 'hidden',
    borderRadius: 16,
  },
  playerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 16,
    marginTop: 10,
  },
  sub2Heading: {
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 15,
  },
  personalInfoItem: {
    marginBottom: 5,
  },
  careerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  careerData: {
    flexDirection: 'column',
  },
  sub1Heading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  teamInfoItem: {
    marginBottom: 5,
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 10,
  },
});

export default Player;

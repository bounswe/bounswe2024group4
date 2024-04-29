import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Context } from "../globalContext/globalContext.js"
import axios from 'axios';

const Player = ({ route }) => {
  const { baseURL } = useContext(Context);
  const [ playerInfo, setPlayerInfo ] = useState("LL");
  const [ isLoading, setIsLoading ] = useState(true);
  const  playerID  =  route.params['id'];
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
        <View style={[styles.sideContainer, styles.backgroundGrey]}>
          <View style={styles.playerImageContainer}>
            <View style={styles.playerImageWrapper}>
              <Image src={playerInfo.image}  style={styles.playerImage} />
            </View>
            <View style={styles.personalInfoContainer}>
              <Text style={styles.personalInfoText}>Personal Information</Text>
              <View style={styles.personalInfoItem}>
                <Text>Height: {playerInfo.height.substr(-4)}</Text>
                <Text>Date of Birth: {playerInfo.date_of_birth.substr(1,10)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.sideContainer, styles.backgroundGrey]}>

          <View style={[styles.personalCareerContainer, styles.careerContainer]}>
            <Text style={styles.personalCareerHeading}>Professional Career</Text>
            <View style={styles.careerItem}>
              <View style={styles.careerData}>
                <Text>Teams:</Text>
                  {Object.keys(playerInfo.teams).map((team) => (
                    <Text key={team}>{team}</Text>
                  ))}
              </View>
            </View>
          </View>

          <View style={[styles.teamInfoContainer, styles.careerContainer]}>
            <Text style={styles.teamInfoHeading}>Position</Text>
            <View style={styles.teamInfoItem}>
            {playerInfo.positions.map((position) => (
                    <Text key={position}>{position}</Text>
                  ))}
            </View>
          </View>

          <View style={[styles.awardsContainer, styles.careerContainer]}>
            <Text style={styles.awardsHeading}>Awards</Text>
            <View style={styles.teamInfoItem}>
                  {Object.keys(playerInfo.awards).map((award) => (
                    <Text key={award}>{award}</Text>
                  ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
    )
    :(
      <View style={styles.scrollContainer}>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#1B64EB",
  },
  frame: {
    height: '60%',
    flexDirection: 'row',
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  sideContainer: {
    flex: 1,
  },
  backgroundGrey: {
    backgroundColor: 'white',
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
  },
  personalInfoText: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  personalInfoContainer: {
    padding: 10,
    borderRadius: 10,
    borderRadius: 16,
  },
  personalInfoItem: {
    marginBottom: 5,
  },
  personalCareerContainer: {
    marginBottom: 20,
    borderRadius: 16,
  },
  careerContainer: {
    padding: 10,
    borderRadius: 10,
    borderRadius: 16,
  },
  personalCareerHeading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  careerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  careerData: {
    flexDirection: 'column',
  },
  teamInfoContainer: {
    marginBottom: 20,
    borderRadius: 16,
  },
  teamInfoHeading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  teamInfoItem: {
    marginBottom: 5,
  },
  awardsContainer: {
    marginBottom: 20,
    borderRadius: 16,
  },
  awardsHeading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Player;

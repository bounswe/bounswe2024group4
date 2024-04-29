import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Player = () => {
  return (
    <View style={styles.container}>

      <View style={styles.frame}>

        <View style={[styles.sideContainer, styles.backgroundGrey]}>

          <View style={styles.playerImageContainer}>
            <View style={styles.playerImageWrapper}>
              <Image source={{ uri: 'https://cdn.nba.com/manage/2020/10/NBA20Primary20Logo-1-259x588.jpg' }} style={styles.playerImage} />
            </View>
            <View style={styles.personalInfoContainer}>
              <Text style={styles.personalInfoText}>Personal Information</Text>
              <View style={styles.personalInfoItem}>
                <Text>Height: </Text>
                <Text>Age: </Text>
              </View>
            </View>
          </View>
        </View>


        <View style={[styles.sideContainer, styles.backgroundGrey]}>

          <View style={[styles.personalCareerContainer, styles.careerContainer]}>
            <Text style={styles.personalCareerHeading}>Professional Career</Text>
            <View style={styles.careerItem}>
              <View style={styles.careerData}>
                <Text>Years:</Text>
                <Text>Year 1</Text>
                <Text>Year 2</Text>
              </View>
              <View style={styles.careerData}>
                <Text>Team:</Text>
                <Text>Team 1</Text>
                <Text>Team 2</Text>
              </View>
            </View>
          </View>

          <View style={[styles.teamInfoContainer, styles.careerContainer]}>
            <Text style={styles.teamInfoHeading}>Team Information</Text>
            <View style={styles.teamInfoItem}>
              <Text>Position:</Text>
            </View>
            <View style={styles.teamInfoItem}>
              <Text>Number:</Text>
            </View>
          </View>

          
          <View style={[styles.awardsContainer, styles.careerContainer]}>
            <Text style={styles.awardsHeading}>Awards</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF9933',
  },
  frame: {
    height: '60%',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
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
  },
  playerImageWrapper: {
    width: '100%',
    aspectRatio: 1, 
    borderRadius: 10,
    overflow: 'hidden',
  },
  playerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  personalInfoText: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  personalInfoContainer: {
    padding: 10,
    borderRadius: 10,
  },
  personalInfoItem: {
    marginBottom: 5,
  },
  personalCareerContainer: {
    marginBottom: 20,
  },
  careerContainer: {
    padding: 10,
    borderRadius: 10,
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
  },
  awardsHeading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Player;

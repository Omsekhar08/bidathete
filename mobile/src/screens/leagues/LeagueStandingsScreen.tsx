import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const leagueStandings = [
  { rank: 1, team: 'Cyber Eagles', wins: 12, losses: 3, logo: 'https://i.imgur.com/team-logo-A.png' },
  { rank: 2, team: 'Robo Warriors', wins: 10, losses: 5, logo: 'https://i.imgur.com/team-logo-B.png' },
  { rank: 3, team: 'Android Giants', wins: 8, losses: 7, logo: 'https://i.imgur.com/team-logo-C.png' },
  { rank: 4, team: 'Tech Titans', wins: 5, losses: 10, logo: 'https://i.imgur.com/team-logo-D.png' },
  { rank: 5, team: 'Mecha Knights', wins: 3, losses: 12, logo: 'https://i.imgur.com/team-logo-E.png' },
];

const LeagueStandingsScreen = () => {
  const renderTeam = ({ item }: any) => (
    <View style={styles.teamRow}>
      <Text style={styles.rank}>{item.rank}</Text>
      <Image source={{ uri: item.logo }} style={styles.teamLogo} />
      <Text style={styles.teamName}>{item.team}</Text>
      <Text style={styles.wins}>{item.wins}</Text>
      <Text style={styles.losses}>{item.losses}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>League Standings</Text>
      <View style={styles.headerRow}>
        <Text style={[styles.headerText, styles.rankHeader]}>Rank</Text>
        <Text style={[styles.headerText, styles.teamHeader]}>Team</Text>
        <Text style={[styles.headerText, styles.winsHeader]}>Wins</Text>
        <Text style={[styles.headerText, styles.lossesHeader]}>Losses</Text>
      </View>
      <FlatList
        data={leagueStandings}
        renderItem={renderTeam}
        keyExtractor={(item) => item.team}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerText: {
    color: '#888',
    fontWeight: 'bold',
  },
  rankHeader: {
    flex: 0.5,
  },
  teamHeader: {
    flex: 2,
    marginLeft: 10,
  },
  winsHeader: {
    flex: 0.5,
    textAlign: 'center',
  },
  lossesHeader: {
    flex: 0.5,
    textAlign: 'center',
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  rank: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 0.5,
  },
  teamLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  teamName: {
    color: '#fff',
    flex: 2,
  },
  wins: {
    color: '#4CAF50',
    fontWeight: 'bold',
    flex: 0.5,
    textAlign: 'center',
  },
  losses: {
    color: '#f44336',
    fontWeight: 'bold',
    flex: 0.5,
    textAlign: 'center',
  },
});

export default LeagueStandingsScreen;

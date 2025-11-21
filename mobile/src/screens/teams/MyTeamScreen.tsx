import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const myTeam = {
  name: 'My Awesome Team',
  logo: 'https://i.imgur.com/your-team-logo.png',
  players: [
    { id: '1', name: 'Player 1', position: 'Forward', image: 'https://i.imgur.com/player1.png' },
    { id: '2', name: 'Player 2', position: 'Guard', image: 'https://i.imgur.com/player2.png' },
    { id: '3', name: 'Player 3', position: 'Center', image: 'https://i.imgur.com/player3.png' },
  ],
};

const MyTeamScreen = () => {
  const renderPlayer = ({ item }: any) => (
    <View style={styles.playerCard}>
      <Image source={{ uri: item.image }} style={styles.playerImage} />
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerPosition}>{item.position}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.teamHeader}>
        <Image source={{ uri: myTeam.logo }} style={styles.teamLogo} />
        <Text style={styles.teamName}>{myTeam.name}</Text>
      </View>
      <FlatList
        data={myTeam.players}
        renderItem={renderPlayer}
        keyExtractor={(item) => item.id}
        style={styles.playerList}
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
  teamHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  teamLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  teamName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  playerList: {
    flex: 1,
  },
  playerCard: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  playerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerPosition: {
    color: '#888',
    marginTop: 5,
  },
});

export default MyTeamScreen;

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const PlayerDetailsScreen = ({ route, navigation }: any) => {
  const { playerId } = route.params;
  const player = {
    id: '1',
    name: 'CyberPlayer 1',
    image: 'https://i.imgur.com/playerA.png',
    price: '1,250,000',
    stats: {
      ppg: '25.3',
      rpg: '8.1',
      apg: '5.5',
    },
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: player.image }} style={styles.playerImage} />
      <Text style={styles.playerName}>{player.name}</Text>
      <Text style={styles.playerPrice}>${player.price}</Text>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{player.stats.ppg}</Text>
          <Text style={styles.statLabel}>PPG</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{player.stats.rpg}</Text>
          <Text style={styles.statLabel}>RPG</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{player.stats.apg}</Text>
          <Text style={styles.statLabel}>APG</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bidButton}>
        <Text style={styles.bidButtonText}>Place Bid</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    padding: 20,
  },
  playerImage: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginBottom: 20,
  },
  playerName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  playerPrice: {
    color: '#4CAF50',
    fontSize: 22,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888',
    marginTop: 5,
  },
  bidButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  bidButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PlayerDetailsScreen;

import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

const auctionDetails = {
  id: '1',
  name: 'Futuristic Crossover',
  players: [
    { id: '1', name: 'CyberPlayer 1', image: 'https://i.imgur.com/playerA.png', price: '1,250,000' },
    { id: '2', name: 'RoboGuard 2', image: 'https://i.imgur.com/playerB.png', price: '950,000' },
    { id: '3', name: 'Android Forward 3', image: 'https://i.imgur.com/playerC.png', price: '1,500,000' },
  ],
};

const AuctionDetailsScreen = ({ route, navigation }: any) => {
  const { auctionId } = route.params;

  const renderPlayer = ({ item }: any) => (
    <TouchableOpacity style={styles.playerCard} onPress={() => navigation.navigate('PlayerDetails', { playerId: item.id })}>
      <Image source={{ uri: item.image }} style={styles.playerImage} />
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerPrice}>${item.price}</Text>
      </View>
      <TouchableOpacity style={styles.bidButton}>
        <Text style={styles.bidButtonText}>Bid</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{auctionDetails.name}</Text>
      <FlatList
        data={auctionDetails.players}
        renderItem={renderPlayer}
        keyExtractor={(item) => item.id}
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
    borderRadius: 10,
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
  playerPrice: {
    color: '#4CAF50',
    marginTop: 5,
  },
  bidButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  bidButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AuctionDetailsScreen;

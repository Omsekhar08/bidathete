import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

const upcomingAuctions = [
  {
    id: '1',
    name: 'Futuristic Crossover',
    date: '2024-08-15',
    image: 'https://i.imgur.com/your-auction-image.png',
  },
  {
    id: '2',
    name: 'Cybernetic Dunk',
    date: '2024-08-20',
    image: 'https://i.imgur.com/your-auction-image.png',
  },
];

const UpcomingAuctionsScreen = ({ navigation }: any) => {
  const renderAuction = ({ item }: any) => (
    <TouchableOpacity style={styles.auctionCard} onPress={() => navigation.navigate('AuctionDetails', { auctionId: item.id })}>
      <Image source={{ uri: item.image }} style={styles.auctionImage} />
      <View style={styles.auctionInfo}>
        <Text style={styles.auctionName}>{item.name}</Text>
        <Text style={styles.auctionDate}>{item.date}</Text>
      </View>
      <TouchableOpacity style={styles.notifyButton}>
        <Text style={styles.notifyButtonText}>Notify Me</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Auctions</Text>
      <FlatList
        data={upcomingAuctions}
        renderItem={renderAuction}
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
  auctionCard: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  auctionImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  auctionInfo: {
    flex: 1,
  },
  auctionName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  auctionDate: {
    color: '#888',
    marginTop: 5,
  },
  notifyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  notifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UpcomingAuctionsScreen;

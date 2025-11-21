import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { wsService } from '../../services/websocket.service';

const LiveBiddingScreen = ({ route }: any) => {
  const { auctionId } = route.params;
  const { token } = useSelector((state: RootState) => state.auth);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidHistory, setBidHistory] = useState([]);

  useEffect(() => {
    // Connect to WebSocket
    wsService.connect(token);
    wsService.joinAuction(auctionId);

    // Listen for bid updates
    wsService.onBidPlaced((data) => {
      setBidHistory((prev) => [data, ...prev]);
    });

    wsService.onPlayerSold((data) => {
      Alert.alert('Player Sold!', `Player sold for ₹${data.amount}`);
    });

    return () => {
      wsService.leaveAuction(auctionId);
      wsService.disconnect();
    };
  }, [auctionId, token]);

  const handlePlaceBid = async () => {
    if (!bidAmount || !currentPlayer) return;

    try {
      await wsService.placeBid({
        auctionId,
        playerId: currentPlayer.id,
        teamId: 'your-team-id', // Get from state
        amount: parseFloat(bidAmount),
      });
      setBidAmount('');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Auction</Text>
      </View>

      {currentPlayer && (
        <View style={styles.playerCard}>
          <Text style={styles.playerName}>{currentPlayer.name}</Text>
          <Text style={styles.basePrice}>
            Base Price: ₹{currentPlayer.basePrice}
          </Text>

          <View style={styles.bidInputContainer}>
            <TextInput
              style={styles.bidInput}
              placeholder="Enter bid amount"
              value={bidAmount}
              onChangeText={setBidAmount}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.bidButton} onPress={handlePlaceBid}>
              <Text style={styles.bidButtonText}>Place Bid</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>Bid History</Text>
        <FlatList
          data={bidHistory}
          keyExtractor={(item: any) => item.bid.id}
          renderItem={({ item }: any) => (
            <View style={styles.bidItem}>
              <Text style={styles.teamName}>{item.team.name}</Text>
              <Text style={styles.bidValue}>₹{item.bid.amount}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    backgroundColor: '#0ea5e9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  basePrice: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  bidInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  bidInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
  },
  bidButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
  },
  bidButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  historySection: {
    flex: 1,
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bidItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  teamName: {
    fontSize: 16,
  },
  bidValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
  },
});

export default LiveBiddingScreen;
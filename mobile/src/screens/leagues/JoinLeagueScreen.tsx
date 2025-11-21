import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const JoinLeagueScreen = ({ navigation }: any) => {
  const [leagueCode, setLeagueCode] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join a League</Text>
      <Text style={styles.subtitle}>Enter the 6-digit code to join a league</Text>
      <TextInput
        style={styles.input}
        placeholder="_ _ _ _ _ _"
        placeholderTextColor="#888"
        value={leagueCode}
        onChangeText={setLeagueCode}
        keyboardType="number-pad"
        maxLength={6}
      />
      <Text style={styles.orText}>OR</Text>
      <TouchableOpacity style={styles.qrButton} onPress={() => { /* Open QR Scanner */ }}>
        <Image source={{ uri: 'https://i.imgur.com/your-qr-code-icon.png' }} style={styles.qrIcon} />
        <Text style={styles.qrButtonText}>Scan QR Code</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.joinButton} onPress={() => { /* Handle Join League */ }}>
        <Text style={styles.joinButtonText}>Join League</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#888',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    letterSpacing: 10,
  },
  orText: {
    color: '#888',
    marginVertical: 20,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  qrIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  qrButtonText: {
    color: '#4CAF50',
    fontSize: 16,
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JoinLeagueScreen;

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({ navigation }: any) => {
  const user = {
    name: 'John Doe',
    avatar: 'https://i.imgur.com/user-avatar.png',
    stats: [
      { label: 'Auctions Won', value: 5 },
      { label: 'Total Bids', value: 128 },
      { label: 'Leagues Joined', value: 3 },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
      </View>
      <View style={styles.statsContainer}>
        {user.stats.map((stat, index) => (
          <View style={styles.stat} key={index}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.menuItem} onPress={() => { /* Navigate to Edit Profile */ }}>
        <Ionicons name="person-outline" size={24} color="#fff" />
        <Text style={styles.menuItemText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => { /* Navigate to Settings */ }}>
        <Ionicons name="settings-outline" size={24} color="#fff" />
        <Text style={styles.menuItemText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => { /* Handle Logout */ }}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.menuItemText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  menuItemText: {
    color: '#fff',
    marginLeft: 15,
    fontSize: 16,
  },
});

export default ProfileScreen;

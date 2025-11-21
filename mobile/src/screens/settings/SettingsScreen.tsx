import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SettingsScreen = ({ navigation }: any) => {
  const menuItems = [
    { title: 'Notifications', icon: 'notifications-outline', screen: 'Notifications' },
    { title: 'Privacy Policy', icon: 'shield-checkmark-outline', screen: 'PrivacyPolicy' },
    { title: 'Terms of Service', icon: 'document-text-outline', screen: 'TermsOfService' },
    { title: 'Support', icon: 'help-circle-outline', screen: 'Support' },
    { title: 'Delete Account', icon: 'trash-outline', screen: 'DeleteAccount' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() => item.screen ? navigation.navigate(item.screen) : {}}
        >
          <Ionicons name={item.icon} size={24} color="#fff" />
          <Text style={styles.menuItemText}>{item.title}</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
        </TouchableOpacity>
      ))}
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
    marginBottom: 30,
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
    flex: 1,
    color: '#fff',
    marginLeft: 15,
    fontSize: 16,
  },
});

export default SettingsScreen;

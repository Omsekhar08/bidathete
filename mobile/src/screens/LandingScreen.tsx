import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const LandingScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://i.imgur.com/your-logo.png' }} style={styles.logo} />
      <Text style={styles.welcomeText}>Welcome!</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Continue with Phone</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={() => { /* Handle Google Sign-In */ }}>
        <Text style={styles.buttonText}>Sign up with Google</Text>
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 50,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LandingScreen;

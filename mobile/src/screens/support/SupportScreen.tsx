import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SupportScreen = () => {
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How can we help you?</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe your issue here..."
        placeholderTextColor="#888"
        value={query}
        onChangeText={setQuery}
        multiline
      />
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.divider} />
      </View>
      <TouchableOpacity style={styles.liveChatButton}>
        <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
        <Text style={styles.liveChatButtonText}>Live Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    minHeight: 150,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#888',
    marginHorizontal: 10,
  },
  liveChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
  },
  liveChatButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default SupportScreen;

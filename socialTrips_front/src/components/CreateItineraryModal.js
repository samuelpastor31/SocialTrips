import React, { useState, useContext } from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import CountryComboBox from './CountryComboBox';
import axios from 'axios';
import { getApiUrl } from '../utils/api'; 
import { UserContext } from '../components/UserContext';

const CreateItineraryModal = ({ visible, onClose }) => {
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [duration, setDuration] = useState('');

  const getUserId = async (username) => {
    try {
      const response = await axios.get(getApiUrl(`usuarios/by-username/${username}`));
      if (response.status === 200) {
        return response.data.id;
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error getting user ID:', error);
      Alert.alert('Error', 'There was a problem getting the user ID.');
      return null;
    }
  };

  const handleCreateItinerary = async () => {
    if (!title || !description || !selectedCountry || !duration) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const userId = await getUserId(username);
    if (userId === null) {
      return;
    }

    const itineraryData = {
      idUsuario: userId,
      titulo: title,
      descripcion: description,
      destino: selectedCountry,
      duracion: parseInt(duration, 10),
    };

    try {
      const response = await axios.post(getApiUrl('itinerarios/create'), itineraryData);
      if (response.status === 200) {
        Alert.alert('Success', 'Itinerary created successfully.');
        onClose();
      }
    } catch (error) {
      console.error('Error creating itinerary:', error);
      Alert.alert('Error', 'There was a problem creating the itinerary.');
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Create Itinerary</Text>
          <CountryComboBox selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Description"
            multiline={true}
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Duration (in days)"
            keyboardType="numeric"
            value={duration}
            onChangeText={setDuration}
          />
          <TouchableOpacity style={styles.createButton} onPress={handleCreateItinerary}>
            <Text style={styles.createButtonText}>Create Itinerary</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButtonContainer} onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 26,
    height: '70%',
    elevation: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 22,
    color: '#007AFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#007AFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    backgroundColor: '#fafdff',
    fontSize: 16,
    color: '#222',
    elevation: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  createButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  cancelButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  cancelButton: {
    color: '#e74c3c',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#f8d7da',
    overflow: 'hidden',
    marginTop: 2,
  },
});

export default CreateItineraryModal;

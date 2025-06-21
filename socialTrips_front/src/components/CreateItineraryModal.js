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
          <Button title="Create Itinerary" onPress={handleCreateItinerary} />
          <TouchableOpacity onPress={onClose}>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '70%',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  cancelButton: {
    marginTop: 10,
    color: 'red',
    textDecorationLine: 'underline',
  },
});

export default CreateItineraryModal;

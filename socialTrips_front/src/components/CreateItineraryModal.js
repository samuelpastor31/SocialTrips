import React, { useState, useContext } from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import CountryComboBox from './CountryComboBox';
import axios from 'axios';
import { getApiUrl } from '../utils/api'; 
import { UserContext } from '../components/UserContext';

const CreateItineraryModal = ({ visible, onClose }) => {
  const { username } = useContext(UserContext);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [duracion, setDuracion] = useState('');

  const getUserId = async (username) => {
    try {
      const response = await axios.get(getApiUrl(`usuarios/by-username/${username}`));
      if (response.status === 200) {
        return response.data.id;
      } else {
        throw new Error('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error obteniendo el ID del usuario:', error);
      Alert.alert('Error', 'Hubo un problema al obtener el ID del usuario.');
      return null;
    }
  };

  const handleCrearItinerario = async () => {
    if (!titulo || !descripcion || !selectedCountry || !duracion) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    const userId = await getUserId(username);
    if (userId === null) {
      return;
    }

    const itinerarioData = {
      idUsuario: userId,
      titulo,
      descripcion,
      destino: selectedCountry,
      duracion: parseInt(duracion, 10),
    };

    try {
      const response = await axios.post(getApiUrl('itinerarios/create'), itinerarioData);
      if (response.status === 200) {
        Alert.alert('Éxito', 'Itinerario creado correctamente.');
        onClose();
      }
    } catch (error) {
      console.error('Error creando el itinerario:', error);
      Alert.alert('Error', 'Hubo un problema al crear el itinerario.');
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Crear Itinerario</Text>
          <CountryComboBox selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
          <TextInput
            style={styles.input}
            placeholder="Título"
            value={titulo}
            onChangeText={setTitulo}
          />
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Descripción"
            multiline={true}
            numberOfLines={4}
            value={descripcion}
            onChangeText={setDescripcion}
          />
          <TextInput
            style={styles.input}
            placeholder="Duración (en días)"
            keyboardType="numeric"
            value={duracion}
            onChangeText={setDuracion}
          />
          <Button title="Crear Itinerario" onPress={handleCrearItinerario} />
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancelar</Text>
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

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getApiUrl } from '../utils/api';
import countries from '../utils/countries';

const ItineraryItemNoLike = ({ itinerary }) => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(getApiUrl(`usuarios/${itinerary.idUsuario}`));
        setUserName(response.data.nombreUsuario);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Hubo un problema al obtener el nombre del usuario.');
      }
    };

    fetchUserName();
  }, [itinerary.idUsuario]);

  const country = countries.find((c) => c.name === itinerary.destino);

  const handlePress = () => {
    navigation.navigate('UserProfileScreen', { userId: itinerary.idUsuario });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{itinerary.titulo}</Text>
      <Text style={styles.description}>{itinerary.descripcion}</Text>
      <Text style={styles.destination}>
        Destino: {country ? ` ${itinerary.destino} ${country.flag}` : itinerary.destino}
      </Text>
      <Text style={styles.duration}>Duración: {itinerary.duracion} días</Text>
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.user}>Creado por: {userName}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
  destination: {
    fontSize: 14,
    color: '#555',
  },
  duration: {
    fontSize: 14,
    color: '#555',
  },
  user: {
    fontSize: 12,
    color: '#007bff',
    marginTop: 5,
    textDecorationLine: 'underline',
  },
});

export default ItineraryItemNoLike;

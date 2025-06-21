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
        Alert.alert('Error', 'There was a problem fetching the user name.');
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
        Destination: {country ? ` ${itinerary.destino} ${country.flag}` : itinerary.destino}
      </Text>
      <Text style={styles.duration}>Duration: {itinerary.duracion} days</Text>
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.user}>Created by: {userName}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
    marginVertical: 12,
    backgroundColor: '#fafdff',
    borderRadius: 16,
    shadowColor: '#007AFF',
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#eaf2fb',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
  },
  destination: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 2,
  },
  duration: {
    fontSize: 14,
    color: '#888',
  },
  user: {
    fontSize: 13,
    color: '#007AFF',
    marginTop: 7,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    letterSpacing: 0.1,
  },
});

export default ItineraryItemNoLike;

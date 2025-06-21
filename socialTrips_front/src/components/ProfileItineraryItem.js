import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import countries from '../utils/countries';

const ProfileItineraryItem = ({ itinerary, onDelete }) => {
  const country = countries.find(c => c.name === itinerary.destino);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{itinerary.titulo}</Text>
        <IconButton
          icon="close"
          color="#ff0000"
          size={20}
          onPress={() => onDelete(itinerary.id)}
        />
      </View>
      <Text style={styles.description}>{itinerary.descripcion}</Text>
      <Text style={styles.destination}>
        Destination: {country ? `${itinerary.destino} ${country.flag}` : itinerary.destino}
      </Text>
      <Text style={styles.duration}>Duration: {itinerary.duracion} days</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});

export default ProfileItineraryItem;

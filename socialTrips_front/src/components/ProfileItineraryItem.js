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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
});

export default ProfileItineraryItem;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, Image } from 'react-native';
import axios from 'axios';
import { getApiUrl } from '../utils/api';
import BackButton from '../components/BackButton';
import ItineraryItemNoLike from '../components/ItineraryItemNoLike';

const UserProfileScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(getApiUrl(`usuarios/${userId}`));
        setUser(userResponse.data);

        const itinerariesResponse = await axios.get(getApiUrl(`itinerarios/by-usuario/${userId}`));
        setItineraries(itinerariesResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'There was a problem loading user data.');
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />
      {user ? (
        <View style={styles.profileContainer}>
          <Image
            source={user.fotoPerfil ? { uri: user.fotoPerfil } : require('./../utils/profilePic1.png')}
            style={styles.profileImage}
          />
          <Text style={styles.title}>{user.nombreUsuario}</Text>
          <Text style={styles.email}>{user.correoElectronico}</Text>
          <Text style={styles.date}>Registered since: {new Date(user.fechaRegistro).toLocaleDateString()}</Text>
          <Text style={styles.header}>Itineraries created by {user.nombreUsuario}</Text>
          <FlatList
            data={itineraries}
            renderItem={({ item }) => <ItineraryItemNoLike itinerary={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
          />
        </View>
      ) : (
        <Text style={styles.loading}>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  list: {
    width: '100%',
    paddingBottom: 16,
  },
  loading: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default UserProfileScreen;

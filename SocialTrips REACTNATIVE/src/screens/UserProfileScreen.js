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
        Alert.alert('Error', 'Hubo un problema al cargar los datos del usuario.');
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
          <Text style={styles.date}>Registrado desde: {new Date(user.fechaRegistro).toLocaleDateString()}</Text>
          <Text style={styles.header}>Itinerarios creados por {user.nombreUsuario}</Text>
          <FlatList
            data={itineraries}
            renderItem={({ item }) => <ItineraryItemNoLike itinerary={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
          />
        </View>
      ) : (
        <Text style={styles.loading}>Cargando...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  list: {
    paddingBottom: 70,
  },
  loading: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default UserProfileScreen;

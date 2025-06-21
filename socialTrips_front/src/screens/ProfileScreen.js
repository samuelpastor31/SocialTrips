import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Alert, StyleSheet, View, FlatList } from 'react-native';
import { Button, Card, Paragraph, Title } from 'react-native-paper';
import axios from 'axios';
import NavigationBar from '../components/NavigationBar';
import { UserContext } from '../components/UserContext';
import { getApiUrl } from '../utils/api';
import ChangeImage from '../components/ChangeImage';
import ProfileItineraryItem from '../components/ProfileItineraryItem';
import EditProfile from '../components/EditProfile';

const ProfileScreen = ({ navigation }) => {
  const { username } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [itinerarios, setItinerarios] = useState([]);
  const [pfp, setPfp] = useState('');

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(getApiUrl(`usuarios/by-username/${username}`));
      const userData = response.data;
      setUser(userData);
      setPfp(userData.fotoPerfil || ''); // Inicializar pfp con la foto de perfil actual

      const itinerariosResponse = await axios.get(getApiUrl(`itinerarios/by-usuario/${userData.id}`));
      setItinerarios(itinerariosResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert('Error', 'Usuario no encontrado.');
      } else {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Hubo un problema al cargar los datos del usuario.');
      }
    }
  }, [username]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleEliminarCuenta = () => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar tu cuenta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await axios.delete(getApiUrl(`usuarios/${user.id}`));
              Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada correctamente.');
              navigation.navigate('MainScreen')
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Hubo un problema al intentar eliminar tu cuenta. Por favor, inténtalo de nuevo más tarde.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteItinerary = (itineraryId) => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar este itinerario?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await axios.delete(getApiUrl(`itinerarios/${itineraryId}`));
              setItinerarios(itinerarios.filter(itinerary => itinerary.id !== itineraryId));
              Alert.alert('Eliminado', 'El itinerario ha sido eliminado correctamente.');
            } catch (error) {
              console.error('Error deleting itinerary:', error);
              Alert.alert('Error', 'Hubo un problema al eliminar el itinerario. Por favor, inténtalo de nuevo.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleLikeToggle = () => {
    setItinerarios(itinerarios => [...itinerarios]);
  };

  const handleImageChange = async (newImage) => {
    if (!user?.id) {
      console.error('User ID is not available.');
      return;
    }
    if (!newImage) {
      console.error('New image is not available.');
      Alert.alert('Error', 'No se ha seleccionado ninguna imagen.');
      return;
    }
    try {
      const response = await axios.put(getApiUrl(`usuarios/${user.id}/fotoPerfil`), { fotoPerfil: newImage });
      if (response.status === 200) {
        setUser(prevUser => ({ ...prevUser, fotoPerfil: newImage }));
        Alert.alert('Éxito', 'La foto de perfil se ha actualizado correctamente.');
      } else {
        console.error('Error updating profile picture:', response);
        Alert.alert('Error', 'Hubo un problema al actualizar la foto de perfil. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        Alert.alert('Error', `Hubo un problema al actualizar la foto de perfil: ${error.response.data.message || error.response.data}`);
      } else {
        Alert.alert('Error', 'Hubo un problema al actualizar la foto de perfil. Por favor, inténtalo de nuevo.');
      }
    }
  };

  useEffect(() => {
    if (pfp && pfp !== user?.fotoPerfil) {
      handleImageChange(pfp);
    }
  }, [pfp]);

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={[{ key: 'header' }, ...itinerarios]}
        renderItem={({ item }) => {
          if (item.key === 'header') {
            return (
              <View style={styles.headerContainer}>
                <Card style={styles.card}>
                  <Card.Content style={styles.cardContent}>
                    <ChangeImage pfp={pfp} setPfp={setPfp} />
                    <Title style={styles.title}>{user ? user.nombreUsuario : ''}</Title>
                    <Paragraph style={styles.email}>{user ? user.correoElectronico : ''}</Paragraph>
                    <Paragraph style={styles.date}>Registrado desde: {user ? new Date(user.fechaRegistro).toLocaleDateString() : ''}</Paragraph>
                  </Card.Content>
                </Card>
                {editing ? (
                  <EditProfile user={user} setEditing={setEditing} fetchUserData={fetchUserData} />
                ) : (
                  <Button
                    icon="pencil"
                    mode="contained"
                    onPress={() => setEditing(true)}
                    style={styles.button}
                  >
                    Editar perfil
                  </Button>
                )}
                <Title style={styles.itinerariesTitle}>
                  {itinerarios.length > 0 ? 'Mis Itinerarios' : 'No hay itinerarios en este perfil'}
                </Title>
              </View>
            );
          }
          return (
            <ProfileItineraryItem
              itinerary={item}
              onDelete={handleDeleteItinerary}
              onLikeToggle={handleLikeToggle}
              userId={user.id}
            />
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={
          <Button
            icon="delete"
            mode="contained"
            onPress={handleEliminarCuenta}
            style={styles.deleteButton}
          >
            Eliminar cuenta
          </Button>
        }
      />
      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  headerContainer: {
    padding: 30,
    paddingBottom: 0,
  },
  card: {
    marginBottom: 16,
  },
  cardContent: {
    alignItems: 'center',
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
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 60, 
    alignSelf: 'center',
  },
  itinerariesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  itinerariesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default ProfileScreen;

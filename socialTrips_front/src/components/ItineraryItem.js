import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, Button, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Ionicons } from 'react-native-vector-icons';
import { getApiUrl } from '../utils/api';
import countries from '../utils/countries';
import LikeButton from './LikeButton';
import { UserContext } from './UserContext'; // Asegúrate de tener el contexto del usuario configurado

const ItineraryItem = ({ itinerary, onLikeToggle }) => {
  const navigation = useNavigation();
  const { username } = useContext(UserContext); // Obtener el nombre de usuario del contexto
  const [userName, setUserName] = useState('');
  const [userProfileImage, setUserProfileImage] = useState('');
  const [likeCount, setLikeCount] = useState(itinerary.contadorMeGusta);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(getApiUrl(`usuarios/${itinerary.idUsuario}`));
        setUserName(response.data.nombreUsuario);
        setUserProfileImage(response.data.fotoPerfil);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Hubo un problema al obtener los datos del usuario.');
      }
    };

    fetchUserDetails();
  }, [itinerary.idUsuario]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(getApiUrl(`usuarios/by-username/${username}`));
        setUserId(response.data.id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
        Alert.alert('Error', 'Hubo un problema al obtener el ID del usuario.');
      }
    };

    fetchUserId();
  }, [username]);

  useEffect(() => {
    const fetchInitialComments = async () => {
      try {
        const response = await axios.get(getApiUrl(`comentarios/itinerario/${itinerary.id}`));
        setComments(response.data);
        setCommentsCount(response.data.length);
      } catch (error) {
        console.error('Error fetching comments:', error);
        Alert.alert('Error', 'Hubo un problema al obtener los comentarios.');
      }
    };

    fetchInitialComments();
  }, [itinerary.id]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(getApiUrl(`comentarios/itinerario/${itinerary.id}`));
      setComments(response.data);
      setCommentsCount(response.data.length);
    } catch (error) {
      console.error('Error fetching comments:', error);
      Alert.alert('Error', 'Hubo un problema al obtener los comentarios.');
    }
  };

  const handlePress = () => {
    navigation.navigate('UserProfileScreen', { userId: itinerary.idUsuario });
  };

  const handleLikeToggle = (newLikeCount) => {
    setLikeCount(newLikeCount);
    onLikeToggle();
  };

  const handleAddComment = async () => {
    if (comment.trim() === '') {
      Alert.alert('Error', 'El comentario no puede estar vacío.');
      return;
    }

    try {
      const response = await axios.post(getApiUrl('comentarios'), {
        idUsuario: userId, // Usar el ID del usuario de la sesión
        idItinerario: itinerary.id,
        contenido: comment,
        fechaComentario: new Date().toISOString()
      });
      if (response.status === 201) {
        Alert.alert('Comentario agregado', 'Tu comentario ha sido agregado correctamente.');
        setComment('');
        setCommentModalVisible(false);
        fetchComments(); // Actualizar comentarios y conteo después de agregar un nuevo comentario
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Hubo un problema al agregar el comentario.');
    }
  };

  const country = countries.find((c) => c.name === itinerary.destino);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.userContainer} onPress={handlePress}>
          <Image 
            source={userProfileImage ? { uri: userProfileImage } : require('./../utils/profilePic1.png')}
            style={styles.userImage}
          />
          <Text style={styles.userName}>{userName}</Text>
        </TouchableOpacity>
        <Text style={styles.timeAgo}>Hace 2 horas</Text>
      </View>
      <Text style={styles.title}>{itinerary.titulo}</Text>
      <Text style={styles.description}>{itinerary.descripcion}</Text>
      <Text style={styles.destination}>
        {itinerary.destino} {country ? country.flag : ''}
      </Text>
      <Text style={styles.duration}>Duración: {itinerary.duracion} días</Text>
      <View style={styles.footer}>
        <View style={styles.actionContainer}>
          <LikeButton itinerary={itinerary} onLikeToggle={handleLikeToggle} />
          <Text style={styles.actionText}>{likeCount}</Text>
        </View>
        <TouchableOpacity style={styles.actionContainer} onPress={() => setCommentModalVisible(true)}>
          <Ionicons name="chatbubble-outline" size={24} color="#666" />
          <Text style={styles.actionText}>Comentar</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.showCommentsButton} onPress={() => {
        setCommentsVisible(!commentsVisible);
        if (!commentsVisible) fetchComments();
      }}>
        <Text style={styles.showCommentsText}>
          {commentsVisible ? 'Ocultar comentarios' : `Mostrar comentarios (${commentsCount})`}
        </Text>
      </TouchableOpacity>
      {commentsVisible && (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <TouchableOpacity onPress={() => navigation.navigate('UserProfileScreen', { userId: item.idUsuario })}>
                <Text style={styles.commentUserName}>{item.nombreUsuario}</Text>
              </TouchableOpacity>
              <Text style={styles.commentContent}>{item.contenido}</Text>
              <Text style={styles.commentDate}>{new Date(item.fechaComentario).toLocaleString()}</Text>
            </View>
          )}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={commentModalVisible}
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar comentario</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Escribe tu comentario aquí"
              value={comment}
              onChangeText={setComment}
            />
            <View style={styles.modalButtons}>
              <Button title="Enviar" onPress={handleAddComment} />
              <Button title="Cancelar" onPress={() => setCommentModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
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
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginLeft: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  timeAgo: {
    fontSize: 12,
    color: '#555',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  showCommentsButton: {
    marginTop: 10,
  },
  showCommentsText: {
    fontSize: 14,
    color: '#007bff',
  },
  commentItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default ItineraryItem;

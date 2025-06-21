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
        Alert.alert('Error', 'There was a problem fetching user data.');
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
        Alert.alert('Error', 'There was a problem fetching the user ID.');
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
        Alert.alert('Error', 'There was a problem fetching comments.');
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
      Alert.alert('Error', 'There was a problem fetching comments.');
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
      Alert.alert('Error', 'Comment cannot be empty.');
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
        Alert.alert('Comment added', 'Your comment has been added successfully.');
        setComment('');
        setCommentModalVisible(false);
        fetchComments(); // Update comments and count after adding a new comment
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'There was a problem adding the comment.');
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
        <Text style={styles.timeAgo}>2 hours ago</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>{itinerary.titulo}</Text>
        <Text style={styles.description}>{itinerary.descripcion}</Text>
        <Text style={styles.destination}>
          {itinerary.destino} {country ? country.flag : ''}
        </Text>
        <Text style={styles.duration}>Duration: {itinerary.duracion} days</Text>
        <View style={styles.footer}>
          <View style={styles.actionContainer}>
            <LikeButton itinerary={itinerary} onLikeToggle={handleLikeToggle} />
            <Text style={styles.actionText}>{likeCount}</Text>
          </View>
          <TouchableOpacity style={styles.actionContainer} onPress={() => setCommentModalVisible(true)}>
            <Ionicons name="chatbubble-outline" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.showCommentsButton} onPress={() => {
          setCommentsVisible(!commentsVisible);
          if (!commentsVisible) fetchComments();
        }}>
          <Text style={styles.showCommentsText}>
            {commentsVisible ? 'Hide comments' : `Show comments (${commentsCount})`}
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
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={commentModalVisible}
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add comment</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Write your comment here"
              value={comment}
              onChangeText={setComment}
              multiline={true}
            />
            <TouchableOpacity style={styles.addCommentButton} onPress={handleAddComment}>
              <Text style={styles.addCommentButtonText}>Add Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelCommentButton} onPress={() => setCommentModalVisible(false)}>
              <Text style={styles.cancelCommentButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginLeft: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#eaf2fb',
    backgroundColor: '#fff',
  },
  timeAgo: {
    fontSize: 12,
    color: '#888',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    marginVertical: 5,
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginVertical: 8,
    marginHorizontal: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 7,
  },
  showCommentsButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
    backgroundColor: '#f0f4ff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  showCommentsText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  commentItem: {
    backgroundColor: '#fafdff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  commentUserName: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentContent: {
    color: '#222',
    fontSize: 15,
    marginVertical: 2,
  },
  commentDate: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '85%',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
  },
  commentInput: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#007AFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fafdff',
    fontSize: 15,
    color: '#222',
    elevation: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  addCommentButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  addCommentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelCommentButton: {
    alignItems: 'center',
    marginTop: 2,
  },
  cancelCommentButtonText: {
    color: '#e74c3c',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 15,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f8d7da',
    overflow: 'hidden',
  },
});

export default ItineraryItem;

import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { getApiUrl } from '../utils/api';
import { UserContext } from '../components/UserContext';

const LikeButton = ({ itinerary, onLikeToggle }) => {
  const { username } = useContext(UserContext);
  const [userId, setUserId] = useState(null);
  const [meGustaId, setMeGustaId] = useState(null);
  const [likeActivado, setLikeActivado] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(getApiUrl(`usuarios/by-username/${username}`));
        const userData = response.data;
        setUserId(userData.id);
        fetchMeGustaId(userData.id, itinerary.id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
        Alert.alert('Error', 'Hubo un problema al cargar los datos del usuario.');
      }
    };

    fetchUserId();
  }, [username, itinerary.id]);

  const fetchMeGustaId = async (userId, itineraryId) => {
    try {
        const response = await axios.get(getApiUrl('megustas/find'), {
          params: {
            userId: userId,
            itineraryId: itineraryId
          }
        });
        if (response.data && response.data.id) {
          setMeGustaId(response.data.id);
          setLikeActivado(true);
        }
      } catch (error) {
      }
  };

  const addRemoveLike = async () => {
    if (!likeActivado) {
      try {
        const response = await axios.post(getApiUrl('megustas'), {
          idUsuario: userId,
          idItinerario: itinerary.id,
        });
        if (response.status === 200) {
          setLikeActivado(true);
          setMeGustaId(response.data.id);
          onLikeToggle(itinerary.contadorMeGusta + 1);
        }
      } catch (error) {
        console.error('Error creating like:', error);
        Alert.alert('Error', 'Hubo un problema al dar me gusta.');
      }
    } else {
      try {
        const response = await axios.delete(getApiUrl(`megustas/${meGustaId}`));
        if (response.status === 204) {
          setLikeActivado(false);
          setMeGustaId(null);
          onLikeToggle(itinerary.contadorMeGusta - 1);
        }
      } catch (error) {
        console.error('Error removing like:', error);
        Alert.alert('Error', 'Hubo un problema al quitar me gusta.');
      }
    }
  };

  return (
    <TouchableOpacity onPress={addRemoveLike}>
      {likeActivado ? (
        <Ionicons name="heart" color={"#e51c1c"} size={32} />
      ) : (
        <Ionicons name="heart-outline" color={"#404040"} size={32} />
      )}
    </TouchableOpacity>
  );
};

export default LikeButton;

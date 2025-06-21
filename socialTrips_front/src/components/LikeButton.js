import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { getApiUrl } from '../utils/api';
import { UserContext } from '../components/UserContext';

const LikeButton = ({ itinerary, onLikeToggle }) => {
  const { username } = useContext(UserContext);
  const [userId, setUserId] = useState(null);
  const [likeId, setLikeId] = useState(null);
  const [likeActive, setLikeActive] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(getApiUrl(`usuarios/by-username/${username}`));
        const userData = response.data;
        setUserId(userData.id);
        fetchLikeId(userData.id, itinerary.id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
        Alert.alert('Error', 'There was a problem loading user data.');
      }
    };

    fetchUserId();
  }, [username, itinerary.id]);

  const fetchLikeId = async (userId, itineraryId) => {
    try {
        const response = await axios.get(getApiUrl('megustas/find'), {
          params: {
            userId: userId,
            itineraryId: itineraryId
          }
        });
        if (response.data && response.data.id) {
          setLikeId(response.data.id);
          setLikeActive(true);
        }
      } catch (error) {
      }
  };

  const addRemoveLike = async () => {
    if (!likeActive) {
      try {
        const response = await axios.post(getApiUrl('megustas'), {
          idUsuario: userId,
          idItinerario: itinerary.id,
        });
        if (response.status === 200) {
          setLikeActive(true);
          setLikeId(response.data.id);
          onLikeToggle(itinerary.contadorMeGusta + 1);
        }
      } catch (error) {
        console.error('Error creating like:', error);
        Alert.alert('Error', 'There was a problem liking.');
      }
    } else {
      try {
        const response = await axios.delete(getApiUrl(`megustas/${likeId}`));
        if (response.status === 204) {
          setLikeActive(false);
          setLikeId(null);
          onLikeToggle(itinerary.contadorMeGusta - 1);
        }
      } catch (error) {
        console.error('Error removing like:', error);
        Alert.alert('Error', 'There was a problem removing the like.');
      }
    }
  };

  return (
    <TouchableOpacity onPress={addRemoveLike}>
      {likeActive ? (
        <Ionicons name="heart" color={"#e51c1c"} size={32} />
      ) : (
        <Ionicons name="heart-outline" color={"#404040"} size={32} />
      )}
    </TouchableOpacity>
  );
};

export default LikeButton;

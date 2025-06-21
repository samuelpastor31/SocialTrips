import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, Image } from 'react-native';
import axios from 'axios';
import { getApiUrl } from '../utils/api';
import BackButton from '../components/BackButton';
import ItineraryItemNoLike from '../components/ItineraryItemNoLike';
import FollowButton from '../components/FollowButton';
import { UserContext } from '../components/UserContext';

const UserProfileScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const { username } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(getApiUrl(`usuarios/${userId}`));
        setUser(userResponse.data);

        const itinerariesResponse = await axios.get(getApiUrl(`itinerarios/by-usuario/${userId}`));
        setItineraries(itinerariesResponse.data);

        const followersRes = await axios.get(getApiUrl(`follows/followers/${userId}`));
        setFollowers(followersRes.data.length);

        const followingRes = await axios.get(getApiUrl(`follows/following/${userId}`));
        setFollowing(followingRes.data.length);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'There was a problem loading user data.');
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    // Get current userId by username
    const fetchCurrentUserId = async () => {
      if (!username) return;
      try {
        const res = await axios.get(getApiUrl(`usuarios/by-username/${username}`));
        setCurrentUserId(res.data.id);
      } catch (e) {}
    };
    fetchCurrentUserId();
  }, [username]);

  const handleFollowChange = (didFollow) => {
    setFollowers(f => didFollow ? f + 1 : f - 1);
  };

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
          <View style={styles.followInfo}>
            <Text style={styles.followCount}>Followers: {followers}</Text>
            <Text style={styles.followCount}>Following: {following}</Text>
          </View>
          <FollowButton currentUserId={currentUserId} targetUserId={userId} onFollowChange={handleFollowChange} />
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
    backgroundColor: '#f4f8fb',
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 28,
    backgroundColor: '#fff',
    borderRadius: 18,
    margin: 16,
    elevation: 5,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#007AFF',
    backgroundColor: '#f4f8fb',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
    letterSpacing: 0.5,
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  header: {
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 10,
    color: '#007AFF',
    letterSpacing: 0.5,
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
  followInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    gap: 16,
  },
  followCount: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: 'bold',
    backgroundColor: '#eaf2fb',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginHorizontal: 6,
    overflow: 'hidden',
    elevation: 1,
  },
});

export default UserProfileScreen;

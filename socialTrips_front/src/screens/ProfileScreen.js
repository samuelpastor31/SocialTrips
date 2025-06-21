import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Alert, StyleSheet, View, FlatList, Text } from 'react-native';
import { Button, Card, Paragraph, Title } from 'react-native-paper';
import axios from 'axios';
import NavigationBar from '../components/NavigationBar';
import { UserContext } from '../components/UserContext';
import { getApiUrl } from '../utils/api';
import ChangeImage from '../components/ChangeImage';
import ProfileItineraryItem from '../components/ProfileItineraryItem';
import EditProfile from '../components/EditProfile';
import FollowButton from '../components/FollowButton';
import UserListModal from '../components/UserListModal';

const ProfileScreen = ({ navigation }) => {
  const { username } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [itineraries, setItineraries] = useState([]);
  const [profilePic, setProfilePic] = useState('');
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [showUserList, setShowUserList] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userListTitle, setUserListTitle] = useState('');
  const [showUnfollow, setShowUnfollow] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(getApiUrl(`usuarios/by-username/${username}`));
      const userData = response.data;
      setUser(userData);
      setProfilePic(userData.fotoPerfil || ''); // Initialize profilePic with current profile picture

      const itinerariesResponse = await axios.get(getApiUrl(`itinerarios/by-usuario/${userData.id}`));
      setItineraries(itinerariesResponse.data);

      const followersRes = await axios.get(getApiUrl(`follows/followers/${userData.id}`));
      setFollowers(followersRes.data.length);
      const followingRes = await axios.get(getApiUrl(`follows/following/${userData.id}`));
      setFollowing(followingRes.data.length);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert('Error', 'User not found.');
      } else {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'There was a problem loading user data.');
      }
    }
  }, [username]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await axios.delete(getApiUrl(`usuarios/${user.id}`));
              Alert.alert('Account deleted', 'Your account has been deleted successfully.');
              navigation.navigate('MainScreen')
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'There was a problem trying to delete your account. Please try again later.');
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
      'Confirmation',
      'Are you sure you want to delete this itinerary?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await axios.delete(getApiUrl(`itinerarios/${itineraryId}`));
              setItineraries(itineraries.filter(itinerary => itinerary.id !== itineraryId));
              Alert.alert('Deleted', 'The itinerary has been deleted successfully.');
            } catch (error) {
              console.error('Error deleting itinerary:', error);
              Alert.alert('Error', 'There was a problem deleting the itinerary. Please try again.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleLikeToggle = () => {
    setItineraries(itineraries => [...itineraries]);
  };

  const handleImageChange = async (newImage) => {
    if (!user?.id) {
      console.error('User ID is not available.');
      return;
    }
    if (!newImage) {
      console.error('New image is not available.');
      Alert.alert('Error', 'No image has been selected.');
      return;
    }
    try {
      const response = await axios.put(getApiUrl(`usuarios/${user.id}/fotoPerfil`), { fotoPerfil: newImage });
      if (response.status === 200) {
        setUser(prevUser => ({ ...prevUser, fotoPerfil: newImage }));
        Alert.alert('Success', 'Profile picture updated successfully.');
      } else {
        console.error('Error updating profile picture:', response);
        Alert.alert('Error', 'There was a problem updating the profile picture. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        Alert.alert('Error', `There was a problem updating the profile picture: ${error.response.data.message || error.response.data}`);
      } else {
        Alert.alert('Error', 'There was a problem updating the profile picture. Please try again.');
      }
    }
  };

  useEffect(() => {
    if (profilePic && profilePic !== user?.fotoPerfil) {
      handleImageChange(profilePic);
    }
  }, [profilePic]);

  const handleShowFollowers = async () => {
    if (!user) return;
    try {
      const res = await axios.get(getApiUrl(`follows/followers/${user.id}`));
      setUserList(res.data.map(f => f.follower));
      setUserListTitle('Followers');
      setShowUnfollow(false);
      setShowUserList(true);
    } catch (e) {
      Alert.alert('Error', 'Could not load followers.');
    }
  };

  const handleShowFollowing = async () => {
    if (!user) return;
    try {
      const res = await axios.get(getApiUrl(`follows/following/${user.id}`));
      setUserList(res.data.map(f => f.following));
      setUserListTitle('Following');
      setShowUnfollow(true);
      setShowUserList(true);
    } catch (e) {
      Alert.alert('Error', 'Could not load following.');
    }
  };

  const handleUnfollow = async (targetUser) => {
    try {
      await axios.delete(getApiUrl('follows/unfollow'), {
        params: { followerId: user.id, followingId: targetUser.id },
      });
      setUserList(userList.filter(u => u.id !== targetUser.id));
      setFollowing(f => f - 1);
      Alert.alert('Unfollowed', `You have unfollowed ${targetUser.nombreUsuario || targetUser.username}`);
    } catch (e) {
      Alert.alert('Error', 'Could not unfollow user.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={[{ key: 'header' }, ...itineraries]}
        renderItem={({ item }) => {
          if (item.key === 'header') {
            return (
              <View style={styles.headerContainer}>
                <Card style={styles.card}>
                  <Card.Content style={styles.cardContent}>
                    <ChangeImage pfp={profilePic} setPfp={setProfilePic} />
                    <Title style={styles.title}>{user ? user.nombreUsuario : ''}</Title>
                    <Paragraph style={styles.email}>{user ? user.correoElectronico : ''}</Paragraph>
                    <Paragraph style={styles.date}>Registered since: {user ? new Date(user.fechaRegistro).toLocaleDateString() : ''}</Paragraph>
                    <View style={styles.followInfo}>
                      <Text style={styles.followCount} onPress={handleShowFollowers}>
                        Followers: {followers}
                      </Text>
                      <Text style={styles.followCount} onPress={handleShowFollowing}>
                        Following: {following}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
                {isEditing ? (
                  <EditProfile user={user} setEditing={setIsEditing} fetchUserData={fetchUserData} />
                ) : (
                  <Button
                    icon="pencil"
                    mode="contained"
                    onPress={() => setIsEditing(true)}
                    style={styles.button}
                  >
                    Edit profile
                  </Button>
                )}
                <Title style={styles.itinerariesTitle}>
                  {itineraries.length > 0 ? 'My Itineraries' : 'No itineraries in this profile'}
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
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
          >
            Delete account
          </Button>
        }
      />
      <UserListModal
        visible={showUserList}
        users={userList}
        title={userListTitle}
        onClose={() => setShowUserList(false)}
        onUnfollow={handleUnfollow}
        showUnfollow={showUnfollow}
      />
      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f4f8fb',
    position: 'relative',
  },
  headerContainer: {
    padding: 30,
    paddingBottom: 0,
  },
  card: {
    marginBottom: 16,
    borderRadius: 18,
    elevation: 6,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    backgroundColor: '#fff',
  },
  cardContent: {
    alignItems: 'center',
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
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 60,
    alignSelf: 'center',
    elevation: 2,
  },
  itinerariesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#007AFF',
    letterSpacing: 0.5,
  },
  itinerariesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  followInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
    marginBottom: 8,
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

export default ProfileScreen;

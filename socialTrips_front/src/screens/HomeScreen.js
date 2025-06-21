import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, FlatList, Text, TextInput } from 'react-native';
import axios from 'axios';
import { FAB, IconButton } from 'react-native-paper';
import NavigationBar from '../components/NavigationBar';
import ItineraryItem from '../components/ItineraryItem';
import CreateItineraryModal from '../components/CreateItineraryModal';
import { UserContext } from '../components/UserContext';
import { getApiUrl } from '../utils/api';

const HomeScreen = ({ navigation }) => {
  const { username } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [itineraries, setItineraries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItineraries, setFilteredItineraries] = useState([]);

  const fetchItineraries = useCallback(async () => {
    try {
      const itinerariesResponse = await axios.get(getApiUrl('itinerarios'));
      const itinerariesData = itinerariesResponse.data;

      const userRequests = itinerariesData.map(itinerary => 
        axios.get(getApiUrl(`usuarios/${itinerary.idUsuario}`))
      );
      
      const usersResponses = await Promise.all(userRequests);
      const usersData = usersResponses.map(response => response.data);

      const enrichedItineraries = itinerariesData.map((itinerary, index) => ({
        ...itinerary,
        nombreUsuario: usersData[index].nombreUsuario
      }));

      setItineraries(enrichedItineraries);
      setFilteredItineraries(enrichedItineraries);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      Alert.alert('Error', 'There was a problem loading the itineraries.');
    }
  }, []);

  useEffect(() => {
    fetchItineraries();
  }, [fetchItineraries]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchItineraries();
    });

    return unsubscribe;
  }, [navigation, fetchItineraries]);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    fetchItineraries(); 
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filteredData = itineraries.filter(item => {
        const destino = item.destino ? item.destino.toLowerCase() : '';
        const nombreUsuario = item.nombreUsuario ? item.nombreUsuario.toLowerCase() : '';
        return destino.includes(query.toLowerCase()) || nombreUsuario.includes(query.toLowerCase());
      });
      setFilteredItineraries(filteredData);
    } else {
      setFilteredItineraries(itineraries);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {username}!</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by destination or user..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#888"
        />
        <IconButton
          icon="magnify"
          size={20}
          onPress={() => handleSearch(searchQuery)}
          color="#007AFF"
          style={styles.searchIcon}
        />
      </View>
      <FlatList
        data={filteredItineraries}
        renderItem={({ item }) => <ItineraryItem itinerary={item} onLikeToggle={fetchItineraries} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        color="#fff"
        onPress={handleOpenModal}
      />
      <CreateItineraryModal
        visible={modalVisible}
        onClose={handleCloseModal}
      />
      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: 70,
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    paddingTop: 25,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fafdff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 44,
    backgroundColor: 'transparent',
    fontSize: 16,
    color: '#222',
  },
  searchIcon: {
    marginLeft: 2,
    backgroundColor: 'transparent',
  },
  list: {
    paddingBottom: 70,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 70,
    backgroundColor: '#007AFF',
    borderRadius: 28,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default HomeScreen;

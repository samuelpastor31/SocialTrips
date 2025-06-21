import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleGoBack}>
      <Image
        source={require('../utils/flecha.png')}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignSelf: 'flex-start',
    margin: 10,
    elevation: 3,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: '#007AFF',
  },
});

export default BackButton;

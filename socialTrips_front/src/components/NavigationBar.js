import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert, Keyboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const NavigationBar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const isActiveScreen = (screenName) => {
    return route.name === screenName;
  };

  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('MainScreen');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleProfile = () => {
    navigation.navigate('ProfileScreen');
  };

  return (
    !keyboardVisible && (
      <View style={styles.container}>
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={[styles.button, isActiveScreen('MainScreen') && styles.activeButton]} 
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Image
              source={require('../utils/cerrar_sesion.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, isActiveScreen('HomeScreen') && styles.activeButton]} 
            onPress={() => navigation.navigate('HomeScreen')}
            activeOpacity={0.7}
          >
            <Image
              source={require('../utils/home.png')}
              style={styles.iconHome}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, isActiveScreen('ProfileScreen') && styles.activeButton]} 
            onPress={handleProfile}
            activeOpacity={0.7}
          >
            <Image
              source={require('../utils/perfil.png')}
              style={styles.iconProfile}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    height: 62,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderColor: '#eaf2fb',
    elevation: 8,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginHorizontal: 6,
  },
  activeButton: {
    backgroundColor: '#007AFF',
    borderBottomWidth: 4,
    borderBottomColor: '#fff',
    borderRadius: 16,
  },
  icon: {
    width: 26,
    height: 26,
    tintColor: '#fff',
  },
  iconHome: {
    width: 26,
    height: 26,
    tintColor: '#fff',
  },
  iconProfile: {
    width: 32,
    height: 32,
    tintColor: '#fff',
  },
});

export default NavigationBar;

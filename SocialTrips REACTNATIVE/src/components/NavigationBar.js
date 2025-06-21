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
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Aceptar',
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
              source={require('../../../SocialTrips/src/utils/cerrar_sesion.png')}
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
              source={require('../../../SocialTrips/src/utils/home.png')}
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
              source={require('../../../SocialTrips/src/utils/perfil.png')}
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
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#3498db', 
    paddingHorizontal: 20,
    height: 56,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeButton: {
    backgroundColor: '#2980b9', 
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#fff', 
  },
  iconHome: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  iconProfile: {
    width: 29,
    height: 29,
    tintColor: '#fff',
  },
});

export default NavigationBar;

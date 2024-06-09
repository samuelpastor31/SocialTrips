import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, Image, Alert } from 'react-native';
import axios from 'axios';
import { UserContext } from '../components/UserContext';
import { getApiUrl } from '../utils/api';

const MainScreen = ({ navigation }) => {
  const { setUsername } = useContext(UserContext); // Obtiene la función para el nombre de usuario
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usuarioError, setUsuarioError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleLogin = async () => {
    if (usuario === '' && password === '') {
      setUsuarioError(true);
      setPasswordError(true);
      return;
    } else {
      setUsuarioError(false);
      setPasswordError(false);
    }

    if (usuario === '') {
      setUsuarioError(true);
      return;
    } else {
      setUsuarioError(false);
    }

    if (password === '') {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    try {
      const response = await axios.post(getApiUrl('usuarios/login'), {
        nombreUsuario: usuario,
        contrasena: password,
      });

      if (response.data === 'Usuario no encontrado') {
        Alert.alert('Error', 'El usuario no existe');
      } else if (response.data === 'Contraseña incorrecta') {
        Alert.alert('Error', 'La contraseña es incorrecta');
      } else {
        setUsername(usuario);
        navigation.navigate('HomeScreen');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert('Error', 'Registrate o revisa tu conexión.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a SocialTrips</Text>
      <Text style={styles.eslogan}>Descubre, viaja, comparte</Text>
      <Image
        source={require("../../../SocialTrips/src/utils/logoSocialTrips.jpeg")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.loginTitle}>Iniciar sesión</Text>
      <TextInput
        style={[styles.input, usuarioError && styles.errorInput]}
        placeholder="Nombre Usuario"
        onChangeText={text => {
          setUsuario(text);
          setUsuarioError(false);
        }}
        value={usuario}
      />
      {usuarioError && <Text style={styles.errorMessage}>Por favor, introduce tu nombre de usuario</Text>}
      <TextInput
        style={[styles.input, passwordError && styles.errorInput]}
        placeholder="Contraseña"
        onChangeText={text => {
          setPassword(text);
          setPasswordError(false);
        }}
        value={password}
        secureTextEntry={!showPassword}
      />
      {passwordError && <Text style={styles.errorMessage}>Por favor, introduce tu contraseña</Text>}
      <View style={styles.checkboxContainer}>
        <Text>Mostrar contraseña</Text>
        <Switch
          value={showPassword}
          onValueChange={setShowPassword}
          style={styles.checkbox}
          trackColor={{ false: '#767577', true: '#007bff' }}
          thumbColor={showPassword ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Iniciar sesión"
          onPress={handleLogin}
          color="#007bff"
        />
      </View>
      <Text style={styles.registerText} onPress={() => navigation.navigate('RegisterScreen')}>
        ¿No tienes una cuenta? Regístrate aquí
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  eslogan: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  logo: {
    width: 250,
    height: 120,
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"#007bff"
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    marginLeft: 'auto',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 10,
  },
  registerText: {
    marginTop: 20,
    textDecorationLine: 'underline',
    color: 'blue',
  },
});

export default MainScreen;

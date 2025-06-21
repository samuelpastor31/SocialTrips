import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, Image, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { UserContext } from '../components/UserContext';
import { getApiUrl } from '../utils/api';

const MainScreen = ({ navigation }) => {
  const { setUsername } = useContext(UserContext); // Gets the function for username
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleLogin = async () => {
    if (usernameInput === '' && password === '') {
      setUsernameError(true);
      setPasswordError(true);
      return;
    } else {
      setUsernameError(false);
      setPasswordError(false);
    }

    if (usernameInput === '') {
      setUsernameError(true);
      return;
    } else {
      setUsernameError(false);
    }

    if (password === '') {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    try {
      const response = await axios.post(getApiUrl('usuarios/login'), {
        nombreUsuario: usernameInput,
        contrasena: password,
      });

      if (response.data === 'Usuario no encontrado') {
        Alert.alert('Error', 'User not found');
      } else if (response.data === 'Contraseña incorrecta') {
        Alert.alert('Error', 'Incorrect password');
      } else {
        setUsername(usernameInput);
        navigation.navigate('HomeScreen');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Sign up or check your connection.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SocialTrips</Text>
      <Text style={styles.eslogan}>Discover, travel, share</Text>
      <Image
        source={require("../utils/logoSocialTrips.jpeg")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.loginTitle}>Log in</Text>
      <TextInput
        style={[styles.input, usernameError && styles.errorInput]}
        placeholder="Username"
        onChangeText={text => {
          setUsernameInput(text);
          setUsernameError(false);
        }}
        value={usernameInput}
        autoCapitalize="none"
        placeholderTextColor="#888"
      />
      {usernameError && <Text style={styles.errorMessage}>Please enter your username</Text>}
      <TextInput
        style={[styles.input, passwordError && styles.errorInput]}
        placeholder="Password"
        onChangeText={text => {
          setPassword(text);
          setPasswordError(false);
        }}
        value={password}
        secureTextEntry={!showPassword}
        placeholderTextColor="#888"
      />
      {passwordError && <Text style={styles.errorMessage}>Please enter your password</Text>}
      <View style={styles.checkboxContainer}>
        <Text>Show password</Text>
        <Switch
          value={showPassword}
          onValueChange={setShowPassword}
          style={styles.checkbox}
          trackColor={{ false: '#767577', true: '#007bff' }}
          thumbColor={showPassword ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')} style={styles.registerButton}>
        <Text style={styles.registerText}>Don't have an account? Sign up here</Text>
      </TouchableOpacity>
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
    height: 44,
    borderWidth: 1.5,
    borderColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#fafdff',
    fontSize: 16,
    color: '#222',
    elevation: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
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
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  registerButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    textDecorationLine: 'underline',
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#f0f4ff',
    overflow: 'hidden',
  },
});

export default MainScreen;

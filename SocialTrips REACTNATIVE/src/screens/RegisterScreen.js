import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import axios from 'axios';
import BackButton from '../components/BackButton';
import { getApiUrl } from '../utils/api';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const handleRegister = async () => {
    let hasError = false;

    if (username === '') {
      setUsernameError(true);
      hasError = true;
    } else {
      setUsernameError(false);
    }

    if (email === '' || !email.includes('@')) {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (password === '') {
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }

    if (confirmPassword === '') {
      setConfirmPasswordError(true);
      hasError = true;
    } else {
      setConfirmPasswordError(false);
    }

    if (password !== confirmPassword) {
      setPasswordError(true);
      setConfirmPasswordError(true);
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (!termsAccepted) {
      setTermsError(true);
      hasError = true;
    } else {
      setTermsError(false);
    }

    if (hasError) {
      return;
    }

    const registerDate = new Date().toISOString();

    try {
      const url = getApiUrl('usuarios/register');
      console.log('URL:', url);

      const response = await axios.post(url, {
        nombreUsuario: username,
        correoElectronico: email,
        contrasena: password,
        fotoPerfil: null,
        fechaRegistro: registerDate
      });

      if (response.data === 'El nombre de usuario ya existe') {
        Alert.alert('Error', 'El nombre de usuario ya existe');
      } else {
        Alert.alert('Registro exitoso', 'Te has registrado correctamente');
        navigation.navigate('MainScreen');
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      Alert.alert('Error al registrar', 'Ha ocurrido un error al intentar registrarse. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <BackButton />
      </View>
      <View style={styles.container}>
        <Text style={styles.registerTitle}>Registrarse</Text>
        <TextInput
          style={[styles.input, usernameError && styles.errorInput]}
          placeholder="Nombre de usuario"
          onChangeText={(text) => {
            setUsername(text);
            setUsernameError(false);
          }}
          value={username}
        />
        {usernameError && <Text style={styles.errorMessage}>Por favor, introduce tu nombre de usuario</Text>}
        <TextInput
          style={[styles.input, emailError && styles.errorInput]}
          placeholder="Correo electrónico"
          onChangeText={(text) => {
            setEmail(text);
            setEmailError(false);
          }}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError && <Text style={styles.errorMessage}>Por favor, introduce un correo electrónico válido</Text>}
        <TextInput
          style={[styles.input, passwordError && styles.errorInput]}
          placeholder="Contraseña"
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError(false);
          }}
          value={password}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        {passwordError && <Text style={styles.errorMessage}>Por favor, introduce tu contraseña</Text>}
        <TextInput
          style={[styles.input, confirmPasswordError && styles.errorInput]}
          placeholder="Confirmar contraseña"
          onChangeText={(text) => {
            setConfirmPassword(text);
            setConfirmPasswordError(false);
          }}
          value={confirmPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        {confirmPasswordError && <Text style={styles.errorMessage}>Por favor, confirma tu contraseña</Text>}
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
        <View style={styles.checkboxContainer}>
          <Switch
            value={termsAccepted}
            onValueChange={setTermsAccepted}
            style={styles.checkbox}
            trackColor={{ false: '#767577', true: '#007bff' }}
            thumbColor={termsAccepted ? '#f4f3f4' : '#f4f3f4'}
          />
          <Text style={{ marginLeft: 10 }}>Acepto los términos y condiciones</Text>
        </View>
        {termsError && <Text style={styles.errorMessage}>Debes aceptar los términos y condiciones</Text>}
        <View style={styles.buttonContainer}>
          <Button
            title="Registrarse"
            onPress={handleRegister}
            color="#007bff"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  registerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007bff',
  },
});

export default RegisterScreen;

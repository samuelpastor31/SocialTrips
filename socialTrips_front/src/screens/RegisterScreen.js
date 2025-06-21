import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Switch, Alert, TouchableOpacity } from 'react-native';
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
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!termsAccepted) {
      setTermsError(true);
      hasError = true;
    } else {
      setTermsError(false);
    }

    if (hasError) return;

    try {
      const response = await axios.post(getApiUrl('usuarios/register'), {
        nombreUsuario: username,
        correoElectronico: email,
        contrasena: password,
      });
      if (response.status === 201) {
        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('MainScreen');
      } else {
        Alert.alert('Error', 'There was a problem creating your account.');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'There was a problem creating your account.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={[styles.input, usernameError && styles.inputError]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor="#888"
      />
      <TextInput
        style={[styles.input, emailError && styles.inputError]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />
      <TextInput
        style={[styles.input, passwordError && styles.inputError]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        placeholderTextColor="#888"
      />
      <TextInput
        style={[styles.input, confirmPasswordError && styles.inputError]}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword}
        placeholderTextColor="#888"
      />
      <View style={styles.switchContainer}>
        <Text>Show Password</Text>
        <Switch value={showPassword} onValueChange={setShowPassword} />
      </View>
      <View style={styles.switchContainer}>
        <Text>I accept the terms and conditions</Text>
        <Switch value={termsAccepted} onValueChange={setTermsAccepted} />
      </View>
      {termsError && <Text style={styles.errorText}>You must accept the terms and conditions</Text>}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#007AFF',
    borderRadius: 12,
    padding: 12,
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
  inputError: {
    borderColor: 'red',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  registerButton: {
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
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default RegisterScreen;

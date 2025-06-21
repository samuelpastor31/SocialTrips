import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios';
import { getApiUrl } from '../utils/api';
import { useNavigation } from '@react-navigation/native';

const EditProfile = ({ user, setEditing, fetchUserData }) => {
  const [username, setUsername] = useState(user.nombreUsuario);
  const [email, setEmail] = useState(user.correoElectronico);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const handleSaveChanges = async () => {
    if (!username || !email || !currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'The new passwords do not match.');
      return;
    }

    const userData = {
      nombreUsuario: username,
      correoElectronico: email,
      contrasenaActual: currentPassword,
      contrasenaNueva: newPassword,
    };

    try {
      await axios.put(getApiUrl(`usuarios/${user.id}`), userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      Alert.alert('Changes saved', 'Your profile has been updated successfully.');
      setEditing(false);
      fetchUserData();
      navigation.navigate('MainScreen');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'There was a problem saving the changes. Please try again.');
    }
  };

  return (
    <View>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        style={styles.textInput}
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.textInput}
      />
      <TextInput
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Current password"
        secureTextEntry={true}
        style={styles.textInput}
      />
      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="New password"
        secureTextEntry={true}
        style={styles.textInput}
      />
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm new password"
        secureTextEntry={true}
        style={styles.textInput}
      />
      <Button
        icon="check"
        mode="contained"
        onPress={handleSaveChanges}
        style={styles.button}
      >
        Save changes
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: 44,
    borderColor: '#007AFF',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
    backgroundColor: '#fafdff',
    elevation: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    fontSize: 16,
    color: '#222',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 18,
    elevation: 2,
  },
});

export default EditProfile;

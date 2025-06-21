import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios';
import { getApiUrl } from '../utils/api';
import { useNavigation } from '@react-navigation/native';

const EditProfile = ({ user, setEditing, fetchUserData }) => {
  const [nombreUsuario, setNombreUsuario] = useState(user.nombreUsuario);
  const [correoElectronico, setCorreoElectronico] = useState(user.correoElectronico);
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [contrasenaConfirmar, setContrasenaConfirmar] = useState('');
  const navigation = useNavigation();

  const handleGuardarCambios = async () => {
    if (!nombreUsuario || !correoElectronico || !contrasenaActual || !contrasenaNueva || !contrasenaConfirmar) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (contrasenaNueva !== contrasenaConfirmar) {
      Alert.alert('Error', 'Las nuevas contraseñas no coinciden.');
      return;
    }

    const userData = {
      nombreUsuario,
      correoElectronico,
      contrasenaActual,
      contrasenaNueva,
    };

    try {
      await axios.put(getApiUrl(`usuarios/${user.id}`), userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      Alert.alert('Cambios guardados', 'Tu perfil ha sido actualizado correctamente.');
      setEditing(false);
      fetchUserData();
      navigation.navigate('MainScreen');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Hubo un problema al guardar los cambios. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <View>
      <TextInput
        value={nombreUsuario}
        onChangeText={setNombreUsuario}
        placeholder="Nombre de usuario"
        style={styles.textInput}
      />
      <TextInput
        value={correoElectronico}
        onChangeText={setCorreoElectronico}
        placeholder="Correo electrónico"
        style={styles.textInput}
      />
      <TextInput
        value={contrasenaActual}
        onChangeText={setContrasenaActual}
        placeholder="Contraseña actual"
        secureTextEntry={true}
        style={styles.textInput}
      />
      <TextInput
        value={contrasenaNueva}
        onChangeText={setContrasenaNueva}
        placeholder="Nueva contraseña"
        secureTextEntry={true}
        style={styles.textInput}
      />
      <TextInput
        value={contrasenaConfirmar}
        onChangeText={setContrasenaConfirmar}
        placeholder="Confirmar nueva contraseña"
        secureTextEntry={true}
        style={styles.textInput}
      />
      <Button
        icon="check"
        mode="contained"
        onPress={handleGuardarCambios}
        style={styles.button}
      >
        Guardar cambios
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});

export default EditProfile;

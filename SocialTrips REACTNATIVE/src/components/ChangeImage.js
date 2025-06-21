import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ChangeImage = ({ pfp, setPfp }) => {
    const handleChooseProfileImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
       
        if (permissionResult.granted === false) {
          alert('Permission to access camera roll is required!');
          return;
        }
        const pickerResult = await ImagePicker.launchImageLibraryAsync();

        if (!pickerResult.canceled) {
            setPfp(pickerResult.assets[0].uri);
        }
    };

    const handleRemoveProfileImage = () => {
        setPfp(''); // Restablece a la imagen predeterminada
    };

    return (
        <View style={styles.container}>
            <Image 
                source={pfp === '' ? require('./../utils/profilePic1.png') : { uri: pfp }} 
                style={styles.image} 
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleChooseProfileImage}>
                    <Entypo name="camera" size={20} color="black" />
                </TouchableOpacity>
                {pfp !== '' && (
                    <TouchableOpacity style={styles.button} onPress={handleRemoveProfileImage}>
                        <MaterialIcons name="delete" size={20} color="black" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        marginBottom: 16,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    button: {
        marginHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 8,
    },
});

export default ChangeImage;

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
        setPfp(''); // Reset to default image
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
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: '#007AFF',
        backgroundColor: '#f4f8fb',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        gap: 10,
    },
    button: {
        marginHorizontal: 6,
        backgroundColor: '#eaf2fb',
        borderRadius: 18,
        padding: 10,
        elevation: 2,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
    },
});

export default ChangeImage;

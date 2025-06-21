import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import countries from '../utils/countries';

const CountryComboBox = ({ selectedCountry, setSelectedCountry }) => {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedCountry}
        onValueChange={(itemValue, itemIndex) => setSelectedCountry(itemValue)}
      >
        {countries.map((country, index) => (
          <Picker.Item key={index} label={`${country.flag} ${country.name}`} value={country.name} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 22,
    backgroundColor: '#fafdff',
    elevation: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
});

export default CountryComboBox;

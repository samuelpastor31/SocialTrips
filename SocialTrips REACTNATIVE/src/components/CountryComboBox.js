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
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default CountryComboBox;

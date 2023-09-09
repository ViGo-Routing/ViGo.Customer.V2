import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SelectBox = ({ options, onValueChange }) => {
  const [selectedValue, setSelectedValue] = useState();
  const [showOptions, setShowOptions] = useState(false);

  const handleOptionPress = (value) => {
    setSelectedValue(value);
    setShowOptions(false);
    onValueChange(value);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => setShowOptions(!showOptions)}
        style={styles.selectedValueContainer}
      >
        <Text style={styles.selectedValue}>
          {selectedValue || 'Select an option'}
        </Text>
      </TouchableOpacity>
      {showOptions && (
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => handleOptionPress(option)}
              style={styles.option}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 70,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedValueContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedValue: {
    fontWeight: 'bold',
  },
  optionsContainer: {
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  option: {
    padding: 10,
  },
});

export default SelectBox;
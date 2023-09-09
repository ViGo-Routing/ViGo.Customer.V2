import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { themeColors } from "../../assets/theme";

const SwtichVehicle = ({ options, selectedOption, onSelect }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          style={[
            styles.button,
            selectedOption === option.vehicleType && styles.selectedButton,
          ]}
          onPress={() => onSelect(option.vehicleType)}
          key={`option_${index}`}
        >
          <View style={styles.buttonContent}>
            <Image source={option.icon} style={styles.image} />
            <Text style={styles.title}>{option.title}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    paddingTop: 10,
    width: "90%",
  },
  button: {
    borderRadius: 15,
    backgroundColor: themeColors.primary,
    padding: 5,
    marginVertical: 5,
    alignItems: "flex-start", // Align icon and title to the left
  },
  selectedButton: {
    backgroundColor: themeColors.secondary, // Add a different background color for the selected button
  },
  buttonContent: {
    flexDirection: "row", // Display icon and title in the same row
    alignItems: "center",
  },
  image: {
    width: 40,
    height: 40,
  },
  title: {
    color: "white",
    marginTop: 5,
    marginLeft: 5, // Add margin between icon and title
  },
});

export default SwtichVehicle;

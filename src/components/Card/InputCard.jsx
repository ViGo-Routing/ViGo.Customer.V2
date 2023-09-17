import React, { useState, useEffect, memo } from "react";
import { View, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { MapPinIcon, UserCircleIcon } from "react-native-heroicons/solid";

const InputCard = ({
  handlePickupPlaceSelection,
  handleDestinationPlaceSelection,
  pickupLocation,
  destinationLocation,
}) => {
  const [startStation, setStartStation] = useState(null);
  const [endStation, setEndStation] = useState(null);

  const [selectedPlace, setSelectedPlace] = useState(null);

  const [pickupPosition, setPickupPosition] = useState(null);
  const [destinationPosition, setDestinationPosition] = useState(null);

  const handlePlaceSelection = (details) => {
    setSelectedPlace(details);
    onPickupPlaceSelect(details); // Pass the selected place details to the parent component
  };

  // const handlePickupPlaceSelection = (details, screen) => {
  //   setPickupPosition(details);
  //   screen === "BikeBookingScreen" && handlePlaceSelection(details);
  // };

  // const handleDestinationPlaceSelection = (details, screen) => {
  //   setDestinationPosition(details);
  //   screen === "BikeBookingScreen" && handlePlaceSelection(details);
  // };

  var pickupPositionRef, destinationPositionRef;

  useEffect(() => {
    if (
      pickupLocation &&
      destinationLocation &&
      pickupPositionRef &&
      destinationPositionRef
    ) {
      pickupPositionRef.setAddressText(
        pickupLocation?.name + ", " + pickupLocation?.formatted_address
      );
      destinationPositionRef.setAddressText(
        destinationLocation?.name +
          ", " +
          destinationLocation?.formatted_address
      );
    }
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <UserCircleIcon size={20} color="blue" />
        {/* <Ionicons name="person-circle-outline" size={20} color="blue" /> */}
        <GooglePlacesAutocomplete
          ref={(ref) => (pickupPositionRef = ref)}
          placeholder="Điểm đón ..."
          styles={{
            textInput: {
              fontSize: 16,
            },
          }}
          onPress={(data, details) => handlePickupPlaceSelection(details)}
          returnKeyType={"search"}
          fetchDetails={true}
          return
          minLength={2}
          enablePoweredByContainer={false}
          query={{
            key: "AIzaSyCIYCycKF24mQXN1pJYFfCO-6azSETj_Qc",
            language: "vn",
          }}
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
        />
      </View>
      <View style={styles.separator} />
      <View style={styles.row}>
        <MapPinIcon size={18} color="orange" />
        {/* <Ionicons name="compass-outline" size={18} color="orange" /> */}
        <GooglePlacesAutocomplete
          ref={(ref) => (destinationPositionRef = ref)}
          placeholder="Điểm đến ..."
          styles={{
            textInput: {
              fontSize: 16,
            },
          }}
          onPress={(data, details) => handleDestinationPlaceSelection(details)}
          returnKeyType={"search"}
          fetchDetails={true}
          return
          minLength={2}
          enablePoweredByContainer={false}
          query={{
            key: "AIzaSyCIYCycKF24mQXN1pJYFfCO-6azSETj_Qc",
            language: "vn",
          }}
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,

    paddingHorizontal: 15,
    // width: "100%",
    marginVertical: 10,
    // marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  input1: {
    height: 25,
    borderColor: "gray",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    flex: 1,
  },
  input: {
    height: 25,
    borderColor: "gray",
    paddingHorizontal: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
});

export default memo(InputCard);

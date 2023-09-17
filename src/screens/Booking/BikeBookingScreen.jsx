import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";

import Map from "../../components/Map/Map";
// import BottomSheet from '../../components/BottomSheet/BottomSheetComponent';
import { themeColors } from "../../assets/theme/index";
import { useNavigation } from "@react-navigation/native";
import InputCard from "../../components/Card/InputCard";
import SwtichVehicle from "../../components/Select Box/SwitchVehicle";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useToast } from "native-base";
import { createRoute } from "../../service/routeService";
import axios from "axios";

const BikeBookingScreen = (props) => {
  const navigation = useNavigation();

  const [selectedOption, setSelectedOption] = useState(null);
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const buttonRows = [
    {
      title: "ViGo Xe Máy",
      screen: "Screen1",
      icon: require("../../assets/icons/vigobike.png"),
      vehicleType: "motorbike",
    },
    {
      title: "ViGo Xe Hơi 4 chỗ",
      screen: "Screen2",
      icon: require("../../assets/icons/vigocar.png"),
      vehicleType: "car",
    },
    {
      title: "ViGo Xe Hơi 7 chỗ",
      screen: "Screen2",
      icon: require("../../assets/icons/vigocar.png"),
      vehicleType: "sevenSeater",
    },
  ];
  const pickup = props.route.params.pickupPosition;
  const destination = props.route.params.destinationPosition;
  const routeType = props.route.params.routeType;
  const frequency = props.route.params.frequency;

  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [pickupPosition, setPickupPosition] = useState(pickup);
  const [destinationPosition, setDestinationPosition] = useState(destination);
  const [routeId, setRouteId] = useState("");
  const toast = useToast();
  useEffect(() => {
    // Function to fetch duration and distance using Google Directions API
    const fetchDirections = async () => {
      const apiKey = "AIzaSyCIYCycKF24mQXN1pJYFfCO-6azSETj_Qc";
      const origin = `${pickupPosition.geometry.location.lat},${pickupPosition.geometry.location.lng}`;
      const destination = `${destinationPosition.geometry.location.lat},${destinationPosition.geometry.location.lng}`;
      const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`;

      try {
        const response = await axios.get(apiUrl);
        const { duration, distance } = response.data.routes[0].legs[0];
        const durationValue = parseFloat(duration.text.split(" ")[0]);
        const distanceValue = parseFloat(distance.text.split(" ")[0]);
        setDuration(durationValue);
        setDistance(distanceValue);
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    };

    // Make the API request when both pickup and destination positions are available
    if (pickupPosition && destinationPosition) {
      fetchDirections();
    }
  }, [pickupPosition, destinationPosition]);

  const handlePlaceSelection = (details) => {
    console.log("Father detail", details);
    setSelectedPlace(details);
    // Do something with the selected place details in the father components
  };
  const handlePickupPlaceSelection = (details) => {
    setPickupPosition(details);
  };

  const handleDestinationPlaceSelection = (details) => {
    setDestinationPosition(details);
  };
  const handleRouteId = (data) => {
    console.log("handleRouteId:", data);
    setRouteId(data);
  };
  const sendRouteId = async () => {
    console.log("frequency" + frequency);
    const requestData = {
      // Request body data
      name: `${pickupPosition.name} - ${destinationPosition.name}`,
      distance: distance,
      duration: duration,
      status: "ACTIVE",
      routineType: frequency,
      type: routeType,
      startStation: {
        longitude: pickupPosition.geometry.location.lng,
        latitude: pickupPosition.geometry.location.lat,
        name: pickupPosition.name,
        address: pickupPosition.formatted_address,
      },
      endStation: {
        longitude: destinationPosition.geometry.location.lng,
        latitude: destinationPosition.geometry.location.lat,
        name: destinationPosition.name,
        address: destinationPosition.formatted_address,
      },
    };
    try {
      await createRoute(requestData).then((response) => {
        const routeId = response.data.id;
        const roundTripRouteId = response.data.roundTripRouteId
        console.log("response", response.data.id, response.data.roundTripRouteId);
        navigation.navigate("RoutineGenerator", {
          routeId: routeId,
          roundTripRouteId: roundTripRouteId,
          frequency: frequency,
          routeType: routeType,
        });
      });
    } catch (error) {
      toast.show({
        title: "Lỗi tạo lịch trình",
        placement: "bottom",
      });
    }
  };
  const slideUp = new Animated.Value(0);
  const slideUpHandler = () => {
    Animated.timing(slideUp, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    slideUpHandler();
  }, []);

  const windowHeight = Dimensions.get("window").height;
  const bottomSlideHeight = windowHeight * 0.3;

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Map
          pickupPosition={pickupPosition}
          destinationPosition={destinationPosition}
          sendRouteId={handleRouteId}
        />
      </View>
      <View
        style={{
          position: "absolute",
          alignSelf: "center",
          top: "5%",
          width: "90%",
        }}
      >
        <InputCard
          pickupLocation={pickupPosition}
          destinationLocation={destinationPosition}
          handlePickupPlaceSelection={handlePickupPlaceSelection}
          handleDestinationPlaceSelection={handleDestinationPlaceSelection}
        />
      </View>

      {/* BACKBUTTON */}
      <View
        style={{
          position: "absolute",
          bottom: bottomSlideHeight + 10,
          left: 10,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <Ionicons name="arrow-back" size={24} color={themeColors.primary} /> */}
            <ArrowLeftIcon size={24} color={themeColors.primary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* BOTTOM SHEET */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          transform: [
            {
              translateY: slideUp.interpolate({
                inputRange: [0, 1],
                outputRange: [bottomSlideHeight, 0],
              }),
            },
          ],
          alignItems: "center",
        }}
        onPickupPlaceSelect={handlePickupPlaceSelection}
        onDestinationPlaceSelect={handleDestinationPlaceSelection}
        visible={true}
      >
        {/* <View style={styles.selectBoxContainer}>
          <TouchableOpacity
            style={[
              styles.selectBox,
              selectedOption === "option1" && styles.selectedOption,
            ]}
            onPress={() => handleOptionSelect("option1")}
          >
            <Text style={styles.selectBoxTitle}>Đi một chiều</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectBox,
              selectedOption === "option2" && styles.selectedOption,
            ]}
            onPress={() => handleOptionSelect("option2")}
          >
            <Text style={styles.selectBoxTitle}>Đi Về</Text>
          </TouchableOpacity>
        </View>

        <SwtichVehicle
          options={buttonRows}
          selectedOption={selectedVehicle}
          onSelect={handleOptionSelect}
        /> */}

        <View
          style={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
            margin: "10%",
            width: "90%",
          }}
        >
          {/* <TouchableOpacity onPress={handleContinueButtonPress} style={styles.continueButton}> */}
          <TouchableOpacity onPress={sendRouteId} style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
  body: {
    flex: 1,
  },
  selectBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
  },
  selectBox: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  selectedOption: {
    backgroundColor: themeColors.primary,
  },
  selectBoxTitle: {
    color: "black",
    fontWeight: "bold",
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: themeColors.primary,
    borderRadius: 10,
    justifyContent: "center",
    width: "90%",
    height: 50,
  },
  continueButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default BikeBookingScreen;

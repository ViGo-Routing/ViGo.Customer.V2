import React, { useState, useEffect, useContext } from "react";
import SelectRouteHeader from "../../components/Header/SelectRouteHeader";
import { StyleSheet, TouchableOpacity } from "react-native";
import InputCard from "../../components/Card/InputCard";
import RecommendedLocation from "../../components/Select Box/RecomendedLocation";
import { themeColors } from "../../assets/theme";
import { useNavigation } from "@react-navigation/native";
import { getStation } from "../../service/stationService";
import { getRouteByUserId } from "../../service/routeService";
import { UserContext } from "../../context/UserContext";
import { ArrowRightIcon, ClockIcon } from "react-native-heroicons/solid";
import { Box, CheckIcon, Text, Select, View, ScrollView } from "native-base";

const SelectRouteScreen = ({ }) => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  const [stations, setStations] = useState([]);

  const [pickupPosition, setPickupPosition] = useState(null);
  const [destinationPosition, setDestinationPosition] = useState(null);
  const [routeType, setRouteType] = useState('ONE_WAY');
  const [frequency, setFrequency] = useState('WEEKLY');
  const handlePlaceSelection = (details) => {
    setSelectedPlace(details);
    onPickupPlaceSelect(details); // Pass the selected place details to the parent component
  };
  const handlePickupPlaceSelection = (details, screen) => {
    setPickupPosition(details);
    console.log("details", details)
    screen === "BikeBookingScreen" && handlePlaceSelection(details);
  };
  const handleChangeRouteType = (value) => {
    setRouteType(value);

  };
  const handleDestinationPlaceSelection = (details, screen) => {
    setDestinationPosition(details);
    screen === "BikeBookingScreen" && handlePlaceSelection(details);
  };
  const handleChangeFrequency = (value) => {
    setFrequency(value);
  };
  const fetchData = async () => {
    try {
      const response = await getRouteByUserId();
      const filteredItems = response.data.data.filter((item) => item.type === routeType); // Filter the data based on routeType
      setStations(filteredItems);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    setRouteType('ONE_WAY');
  }, []);
  useEffect(() => {
    fetchData(); // Fetch data when component mounts and when routeType changes
  }, [routeType]);

  return (

    <View style={styles.container}>

      <View style={styles.header}>
        <SelectRouteHeader
          title="Chọn tuyến đường"
          subtitle="Bạn muốn đi đâu?"
          onBack={() => navigation.goBack()}
        />
      </View>
      <View style={styles.body}>



        <Text pl={5} alignSelf="flex-start" bold fontSize={20} w={200}>Loại chuyến: </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 20 }}>
          <Box style={[styles.cardInsideDateTime, styles.shadowProp]}>
            <Text style={styles.inputTitle}>Lịch trình đi: </Text>
            <Select
              selectedValue={frequency}
              minWidth={170}
              accessibilityLabel="Choose option"

              onValueChange={handleChangeFrequency}
              _selectedItem={{
                bg: themeColors.linear,
                endIcon: <CheckIcon size={2} />,
              }}
              borderWidth={0}
            >
              <Select.Item label="Mỗi tuần" value="WEEKLY" />
              <Select.Item label="Mỗi tháng" value="MONTHLY" />
            </Select>
          </Box>
          <Box style={[styles.cardInsideDateTime, styles.shadowProp]}>
            <Text style={styles.inputTitle}>Loại chuyến: </Text>
            <Select
              selectedValue={routeType}
              minWidth={170}
              accessibilityLabel="Choose option"

              onValueChange={handleChangeRouteType}
              _selectedItem={{
                bg: themeColors.linear,
                endIcon: <CheckIcon size={2} />,
              }}
              borderWidth={0}
            >
              <Select.Item label="Chuyến một chiều" value="ONE_WAY" />
              <Select.Item label="Chuyến hai chiều" value="ROUND_TRIP" />
            </Select>
          </Box>
        </View>
        <Text pl={5} alignSelf="flex-start" bold fontSize={20} w={200}>Tuyến đường: </Text>
        <Box w="90%">

          <InputCard
            handlePickupPlaceSelection={handlePickupPlaceSelection}
            handleDestinationPlaceSelection={handleDestinationPlaceSelection}
          />
        </Box>

        <RecommendedLocation
          title="Tuyến đường được đề xuất"
          items={stations.map((station) => ({
            iconLeft: <ClockIcon size={24} color="black" />,
            response: station,
            iconRight: <ArrowRightIcon size={24} color="black" />,
          }))}
          routeType={routeType}
          frequency={frequency}
        />
        <View style={styles.card}>

        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("BikeBooking", {
              pickupPosition: pickupPosition,
              destinationPosition: destinationPosition,
              routeType: routeType,
              frequency: frequency
            })
          }
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Tiếp tục</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default SelectRouteScreen;

const styles = StyleSheet.create({
  cardInsideDateTime: {
    flexGrow: 1,
    backgroundColor: 'white',
    borderRadius: 10,

    paddingHorizontal: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    flexGrow: 1,
    margin: 5

  },
  inputTitle: {
    borderRadius: 10,
    color: themeColors.linear,
    position: "absolute",
    top: -8,
    left: 10,
    backgroundColor: themeColors.primary,
    paddingHorizontal: 5,
    zIndex: 1,
  },
  body: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  card: {
    alignItems: "center",
    width: "100%",
  },
  button: {
    width: "90%",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: themeColors.primary,
    alignItems: "center",
  },
  card_button: {
    marginTop: "75%",
    alignItems: "center",
    width: "100%",
  },
});

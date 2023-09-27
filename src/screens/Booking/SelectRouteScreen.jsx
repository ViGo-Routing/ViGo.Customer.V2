import React, { useState, useEffect, useContext } from "react";
import SelectRouteHeader from "../../components/Header/SelectRouteHeader";
import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import InputCard from "../../components/Card/InputCard";
import RecommendedLocation from "../../components/Select Box/RecomendedLocation";
import { themeColors, vigoStyles } from "../../assets/theme";
import { useNavigation } from "@react-navigation/native";
import { getStation } from "../../service/stationService";
import { getRouteByUserId } from "../../service/routeService";
import { UserContext } from "../../context/UserContext";
import { ArrowRightIcon, ClockIcon } from "react-native-heroicons/solid";
import {
  Box,
  CheckIcon,
  Text,
  Select,
  View,
  ScrollView,
  VStack,
} from "native-base";
import ViGoStationSelect from "../../components/Map/ViGoStationSelect";

const SelectRouteScreen = ({}) => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  const [stations, setStations] = useState([]);

  const [pickupPosition, setPickupPosition] = useState(null);
  const [destinationPosition, setDestinationPosition] = useState(null);
  const [routeType, setRouteType] = useState("ONE_WAY");
  const [frequency, setFrequency] = useState("WEEKLY");

  const [pickupStation, setPickupStation] = useState(null);
  const [dropoffStation, setDropoffStation] = useState(null);

  const handlePlaceSelection = (details) => {
    setSelectedPlace(details);
    onPickupPlaceSelect(details); // Pass the selected place details to the parent component
  };
  const handlePickupPlaceSelection = (details, screen) => {
    setPickupPosition(details);
    console.log("details", details);
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
      const filteredItems = response.data.data.filter(
        (item) => item.type === routeType
      ); // Filter the data based on routeType
      setStations(filteredItems);
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
      console.error(error);
    }
  };
  useEffect(() => {
    setRouteType("ONE_WAY");
  }, []);
  useEffect(() => {
    fetchData(); // Fetch data when component mounts and when routeType changes
  }, [routeType]);

  return (
    <SafeAreaView style={vigoStyles.container}>
      <View style={styles.header}>
        <SelectRouteHeader
          title="Chọn tuyến đường"
          subtitle="Bạn muốn đi đâu?"
          onBack={() => navigation.goBack()}
        />
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
      >
        <VStack style={styles.body}>
          <Text pl={5} alignSelf="flex-start" bold fontSize={20} w={200}>
            Loại chuyến:{" "}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingBottom: 20,
              // paddingHorizontal: 20,
            }}
          >
            <Box style={[styles.cardInsideDateTime, styles.shadowProp]}>
              <Text style={styles.inputTitle}>Lịch trình đi: </Text>
              <Select
                selectedValue={frequency}
                minWidth={170}
                flex={1}
                accessibilityLabel="Choose option"
                onValueChange={handleChangeFrequency}
                // _selectedItem={{
                //   bg: themeColors.linear,
                //   endIcon: <CheckIcon size={2} />,
                // }}
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
                flex={1}
                accessibilityLabel="Choose option"
                onValueChange={handleChangeRouteType}
                // _selectedItem={{
                //   bg: themeColors.linear,
                //   endIcon: <CheckIcon size={2} />,
                // }}
                borderWidth={0}
              >
                <Select.Item label="Chuyến một chiều" value="ONE_WAY" />
                <Select.Item label="Chuyến hai chiều" value="ROUND_TRIP" />
              </Select>
            </Box>
          </View>
          <Text pl={5} alignSelf="flex-start" bold fontSize={20} w={200}>
            Tuyến đường:{" "}
          </Text>
          <VStack w="90%">
            {/* <InputCard
            handlePickupPlaceSelection={handlePickupPlaceSelection}
            handleDestinationPlaceSelection={handleDestinationPlaceSelection}
          /> */}
            <View style={styles.card}>
              <VStack my="3">
                <Box mb="2">
                  <ViGoStationSelect
                    displayName="Điểm đón"
                    placeholder="Chọn điểm đón..."
                    setSelectedStation={setPickupStation}
                    selectedStation={pickupStation}
                  />
                </Box>
                <Box mt="2">
                  <ViGoStationSelect
                    displayName="Điểm đến"
                    placeholder="Chọn điểm đến..."
                    setSelectedStation={setDropoffStation}
                    selectedStation={dropoffStation}
                  />
                </Box>
              </VStack>
            </View>
          </VStack>

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
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("BikeBooking", {
                pickupPosition: {
                  geometry: {
                    location: {
                      lat: pickupStation.latitude,
                      lng: pickupStation.longitude,
                    },
                  },
                  name: pickupStation.name,
                  formatted_address: pickupStation.address,
                },
                destinationPosition: {
                  geometry: {
                    location: {
                      lat: dropoffStation.latitude,
                      lng: dropoffStation.longitude,
                    },
                  },
                  name: dropoffStation.name,
                  formatted_address: dropoffStation.address,
                },
                routeType: routeType,
                frequency: frequency,
              })
            }
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Tiếp tục</Text>
          </TouchableOpacity>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectRouteScreen;

const styles = StyleSheet.create({
  cardInsideDateTime: {
    // flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 10,

    paddingHorizontal: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    flexGrow: 1,
    margin: 5,
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
    // justifyContent: "space-between",
    // paddingHorizontal: 5,
    // flex: 1,
  },
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

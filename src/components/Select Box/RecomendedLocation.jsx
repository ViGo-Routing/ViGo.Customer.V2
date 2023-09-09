import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getStation } from "../../service/stationService";
import { FireIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";

const RecommendedLocation = ({ title, items, routeType, frequency }) => {
  const [stations, setStations] = useState([]);
  const navigation = useNavigation();
  const handleGetStations = () => {
    getStation({ PageNumber: 1, PageSize: 10 })
      .then((response) => setStations(response.data))
      .catch((error) => console.error(error));
  };
  const handelPosition = (item) => {
    console.log("itemitem", item)
    const pickupPosition =
      item?.startStation?.latitude && item?.startStation?.longitude
        ? {
          geometry: {
            location: {
              lat: item.startStation.latitude,
              lng: item.startStation.longitude,
            },
          },
          address: item.startStation.address,
          name: item.startStation.name,
          formatted_address: item.startStation.address,
        }
        : null;

    const destinationPosition =
      item?.endStation?.latitude && item?.endStation?.longitude
        ? {
          geometry: {
            location: {
              lat: item.endStation.latitude,
              lng: item.endStation.longitude,
            },
          },
          address: item.endStation.address,
          name: item.endStation.name,
          formatted_address: item.endStation.address,
        }
        : null;

    navigation.navigate("BikeBooking", {
      pickupPosition: destinationPosition,
      destinationPosition: pickupPosition,
      routeType: routeType,
      frequency: frequency
    })
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {/* <Ionicons name="flame" size={25} color="orange" /> */}
        <FireIcon size={25} color="orange" />
        {title}
      </Text>
      <View style={styles.separator} />
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollView}
      >
        <View style={styles.list}>
          {items.map((item, index) => (
            <TouchableOpacity key={index} style={styles.listItem} onPress={() =>
              handelPosition(item.response)
            }>
              {item.iconLeft}
              <View>
                <Text style={styles.listItemText} numberOfLines={1}>
                  {item.response.startStation.name} - {item.response.endStation.name}
                </Text>
              </View>
              {item.iconRight}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 380,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    width: "90%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "orange",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  container: {
    flexGrow: 1,
  },
  scrollView: {
    height: 200, // Set a fixed height for the ScrollView
  },
  list: {
    flexDirection: "column",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  listItemText: {
    flex: 1,
    marginHorizontal: 10,
    width: 240,
  },
  listItemAddress: {
    color: "#999",
    fontSize: 12,
  },
});

export default RecommendedLocation;

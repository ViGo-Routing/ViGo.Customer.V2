import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { getBookingDetail, getBookingDetailByBookingId } from "../../service/bookingService";
import CardHistory from "../../components/CardSchedule/CardHistory";
import { themeColors, vigoStyles } from "../../assets/theme";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import { FlatList } from "native-base";
import CardBookingDetail from "../../components/CardSchedule/CardBookingDeetail";

const OnGoingScreen = ({ id, navigation, isLoading, setIsLoading }) => {
  const { user } = useContext(UserContext);
  const [list, setList] = useState([]);
  //   const [isLoading, setIsLoading] = useState(false);

  const [onScroll, setOnScroll] = useState(false);
  const [nextPageNumber, setNextPageNumber] = useState(1);

  const pageSize = 10;

  const status =
    "ASSIGNED,GOING_TO_PICKUP,ARRIVE_AT_PICKUP,GOING_TO_DROPOFF,ARRIVE_AT_DROPOFF";
  const fetchData = async () => {
    setIsLoading(true);
    await getBookingDetailByBookingId(id, status).then((result) => {
      const items = result.data.data;
      setList(items);
      setIsLoading(false);

      console.log("elementelement", items);
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });
    return unsubscribe;
  }, []);

  const loadMoreTrips = async () => {
    if (!onScroll) {
      return;
    }

    if (nextPageNumber > 1) {
      let trips = await getBookingDetailByBookingId(
        id,
        status,
        pageSize,
        nextPageNumber
      );

      const moreTrips = [...list, ...trips.data.data];

      setList(moreTrips);

      if (moreTrips.hasNextPage == true) {
        setNextPageNumber(nextPageNumber + 1);
      } else {
        setNextPageNumber(null);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* <ViGoSpinner isLoading={isLoading} /> */}
      {/* {list.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {list.map((element) => (
            <CardHistory key={element.id} element={element} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.text}>Chưa có dữ liệu</Text>
        </View>
      )} */}
      <FlatList
        style={vigoStyles.list}
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <CardBookingDetail item={item} />;
        }}
        ListEmptyComponent={<Text style={styles.text}>Chưa có dữ liệu</Text>}
        refreshing={isLoading}
        onRefresh={() => fetchData()}
        onEndReached={loadMoreTrips}
        onScroll={() => setOnScroll(true)}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContainer: {
    padding: 10,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
    color: themeColors.primary,
  },
});
export default OnGoingScreen;

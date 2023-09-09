import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { themeColors, vigoStyles } from "../../assets/theme/index.jsx";
import { useNavigation } from "@react-navigation/native";
// IMPORT COMPONENTS
import BottomNavigationBar from "../../components/NavBar/BottomNavigationBar.jsx";
import HomeHeader from "../../components/Header/HomeHeader.jsx";
import CustomButton from "../../components/Button/CustomButton.jsx";
import PromotionCardSwiper from "../../components/Card/PromotionCardSwiper.jsx";
// import { getAuth } from "firebase/auth";
import {
  Avatar,
  Box,
  FlatList,
  HStack,
  Heading,
  Image,
  NativeBaseProvider,
  Spacer,
  View,
  Text,
  VStack,
  Fab,
  Center,
  AntDesign,
  Icon,
  AddIcon,
} from "native-base";
import { UserContext } from "../../context/UserContext.jsx";
import { getBookingByCustomerId, getBookingDetail } from "../../service/bookingService.jsx";
import CardHistory from "../../components/CardSchedule/CardHistory.jsx";
import { PlusIcon } from "react-native-heroicons/solid";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner.jsx";
const HomeScreen = () => {
  // const auth = getAuth();
  // console.log(auth);
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [list, setList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [onScroll, setOnScroll] = useState(false);
  const [nextPageNumber, setNextPageNumber] = useState(1);

  const pageSize = 10;

  const fetchData = async () => {
    setIsLoading(true);

    await getBookingByCustomerId(user.id, pageSize, 1).then(
      (result) => {
        const items = result.data.data;
        setList(items);
        setIsLoading(false);
        console.log("itemsitems", result.data)
        if (result.data.hasNextPage == true) {
          setNextPageNumber(2);
        } else {
          setNextPageNumber(null);
        }
        // console.log("elementelement", items)
      }
    );
  };

  const loadMoreTrips = async () => {
    if (!onScroll) {
      return;
    }

    if (nextPageNumber > 1) {
      let trips = await getBookingByCustomerId(
        user.id,
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

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });

    return unsubscribe;
  }, []);

  const formatMoney = (money) => {
    const formattedCurrency = money.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    return formattedCurrency;
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HomeHeader title="Home" />
      </View>
      <View p="4">
        <Heading>
          {" "}
          <Text>Hành trình của bẹn</Text>
        </Heading>
      </View>

      {/* <ViGoSpinner isLoading={isLoading} /> */}
      <View style={styles.body}>
        <View style={styles.container}>
          <FlatList
            style={vigoStyles.list}
            data={list}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return <CardHistory key={item.id} element={item} />;
            }}
            ListEmptyComponent={
              <Text style={styles.text}>Chưa có dữ liệu</Text>
            }
            refreshing={isLoading}
            onRefresh={() => fetchData()}
            onEndReached={loadMoreTrips}
            onScroll={() => setOnScroll(true)}
            onEndReachedThreshold={0.5}
          />
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
        </View>
      </View>
      <View>
        <Fab
          onPress={() => navigation.navigate("SelectRoute")}
          bg={themeColors.primary}
          renderInPortal={false}
          shadow={2}
          right={10}
          bottom={30}
          size="sm"
          icon={<AddIcon color="white" />}
          label={
            <Text bold color="white">
              Đặt xe với lộ trình mới
            </Text>
          }
        />
      </View>
      <View style={styles.footer}>
        <BottomNavigationBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column", // inner items will be added vertically
    flexGrow: 1, // all the available vertical space will be occupied by it
    justifyContent: "space-between", // will create the gutter between body and footer
    backgroundColor: themeColors.linear,
  },
  imgae: {
    width: 40,
    height: 40,
  },
  body: {
    flex: 1,
  },
  iconRow: {
    paddingTop: 10,
    flexDirection: "row",
    padding: 10,
  },
  box: {
    borderRadius: 10,
    backgroundColor: themeColors.primary,
    padding: 5,
    marginHorizontal: 5,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;

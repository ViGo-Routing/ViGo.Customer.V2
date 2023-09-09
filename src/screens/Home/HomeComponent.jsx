import { memo } from "react";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { themeColors, vigoStyles } from "../../assets/theme/index";
import { useNavigation } from "@react-navigation/native";
// IMPORT COMPONENTS
import HomeHeader from "../../components/Header/HomeHeader";
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
import { UserContext } from "../../context/UserContext";
import {
  getBookingByCustomerId,
  getBookingDetail,
} from "../../service/bookingService";
import CardHistory from "../../components/CardSchedule/CardHistory";
import { PlusIcon } from "react-native-heroicons/solid";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import InfoAlert from "../../components/Alert/InfoAlert";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";

const HomeComponent = () => {
  // const auth = getAuth();
  // console.log(auth);
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [list, setList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [onScroll, setOnScroll] = useState(false);
  const [nextPageNumber, setNextPageNumber] = useState(1);

  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();
  const pageSize = 10;

  const fetchData = async () => {
    setIsLoading(true);

    await getBookingByCustomerId(user.id, pageSize, 1).then((result) => {
      const items = result.data.data;
      setList(items);
      setIsLoading(false);
      console.log("itemsitems", result.data);
      if (result.data.hasNextPage == true) {
        setNextPageNumber(2);
      } else {
        setNextPageNumber(null);
      }
      // console.log("elementelement", items)
    });
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

      if (trips.data.hasNextPage == true) {
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
    <>
      <View backgroundColor={"white"}>
        <HomeHeader title="Home" />
      </View>

      {/* <ViGoSpinner isLoading={isLoading} /> */}
      <View style={vigoStyles.body}>
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          <Heading fontSize="2xl" mt="0" ml="0">
            Hành trình của bạn
          </Heading>
          <FlatList
            // style={[vigoStyles.list]}
            marginTop="3"
            data={list}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return <CardHistory key={item.id} element={item} />;
            }}
            ListEmptyComponent={<InfoAlert message="Chưa có dữ liệu" />}
            refreshing={isLoading}
            onRefresh={() => fetchData()}
            onEndReached={loadMoreTrips}
            onScroll={() => setOnScroll(true)}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{
              // paddingHorizontal: 20,
              paddingVertical: 10,
              paddingBottom: 10,
            }}
          />
          <Fab
            onPress={() => navigation.navigate("SelectRoute")}
            bg={themeColors.primary}
            renderInPortal={false}
            shadow={2}
            // right={5}
            // bottom={0}
            size="sm"
            icon={<AddIcon color="white" />}
            label={
              <Text bold color="white">
                Đặt xe với lộ trình mới
              </Text>
            }
          />
        </ErrorAlert>
      </View>
    </>
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

export default memo(HomeComponent);

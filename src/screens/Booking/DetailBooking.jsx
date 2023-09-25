import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  ScrollView,
  View,
  Avatar,
  Text,
  Box,
  HStack,
  Icon,
  Button,
  useTheme,
  VStack,
  Divider,
  Input,
  TextArea,
  Flex,
  Center,
  Pressable,
} from "native-base";
import {
  ArrowsRightLeftIcon,
  CalendarIcon,
  StarIcon,
} from "react-native-heroicons/solid";

import { useNavigation } from "@react-navigation/native";

import { MinusIcon } from "react-native-heroicons/solid";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ArrowsUpDownIcon,
  CurrencyDollarIcon,
  ArrowSmallRightIcon,
} from "react-native-heroicons/outline";
import { themeColors, vigoStyles } from "../../assets/theme";
import Header from "../../components/Header/Header";
import {
  getBookingById,
  getBookingDetail,
  getBookingDetailById,
} from "../../service/bookingService";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import OnGoingScreen from "../History/OnGoingScreen";
import CancelScreen from "../History/CancelScreen";
import HistoryScreen from "../History/HistoryScreen";
import PendingScreen from "../History/PendingScreen";
import SelectRouteHeader from "../../components/Header/SelectRouteHeader";
import { SafeAreaView } from "react-native";
import { Animated } from "react-native";
export const DetailBookingScreen = ({ route }) => {
  const { bookingDetail } = route.params;
  const theme = useTheme();
  const navigation = useNavigation();
  //const [bookingDetails, setBookingDetail] = useState(null);

  const [isGoingLoading, setIsGoingLoading] = useState(false);
  const [isPendingLoading, setIsPendingLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const Tab = createMaterialTopTabNavigator();
  // const fetchData = async () => {
  //     try {
  //         getBookingDetailById(bookingDetail.id).then((response) => {
  //             console.log("bookingDetail", response.data);
  //             setBookingDetail(response.data);
  //             setIsLoading(false)
  //         });
  //     } catch (error) {
  //         console.error(error);
  //     }
  // };

  // useEffect(() => {
  //     setIsLoading(true)
  //     fetchData();
  // }, []);

  const renderTabBar = ({ state, descriptors, navigation, position }) => {
    // const inputRange = props.navigationState.routes.map((x: any, i: any) => i);
    return (
      <Box flexDirection="row">
        {state.routes.map((route, i) => {
          // const opacity = props.position.interpolate({
          //   inputRange,
          //   outputRange: inputRange.map((inputIndex: any) =>
          //     inputIndex === i ? 1 : 0.5
          //   ),
          // });

          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          // const color = index === i ?
          const borderColor =
            state.index === i ? themeColors.primary : "#e5e5e5";
          const textColor = state.index === i ? themeColors.primary : "black";
          const isBold = state.index === i;
          const isFocus = state.index === i;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocus && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          return (
            <Box
              borderBottomWidth="3"
              borderColor={borderColor}
              flex={1}
              alignItems="center"
              p="2"
              key={label}
              // mx="2"
            >
              <Pressable onPress={onPress}>
                <Animated.Text>
                  <Text textAlign={"center"} color={textColor} bold={isBold}>
                    {label}
                  </Text>
                </Animated.Text>
              </Pressable>
            </Box>
          );
        })}
      </Box>
    );
  };

  console.log("bookingDetailssss", bookingDetail);
  return (
    <SafeAreaView style={vigoStyles.container}>
      <SelectRouteHeader
        title="Chi tiết chuyến đi"
        subtitle="Bạn có thể xem lại chuyến đi theo màn hiện tại."
        onBack={() => navigation.goBack()}
      />
      <View style={vigoStyles.body}>
        <ScrollView nestedScrollEnabled>
          {/* <SelectRouteHeader
                title="Đánh giá"
                subtitle="Tài xế bạn đi như thế nào?"
                onBack={() => navigation.goBack()}
            /> */}
          {bookingDetail === null ? (
            <ViGoSpinner isLoading={isLoading} />
          ) : (
            <Box px="2">
              <VStack>
                <Box style={[styles.cardInsideLocation, styles.shadowProp]}>
                  <HStack alignItems="center">
                    <HStack alignSelf="flex-start" justifyContent="center">
                      <VStack alignSelf="center">
                        <MapPinIcon size={25} color="#00A1A1" />
                      </VStack>

                      <VStack alignItems="flex-start" justifyContent="center">
                        <Text style={styles.title}>Điểm đón</Text>

                        <Text
                          style={{
                            paddingLeft: 5,
                            paddingBottom: 5,
                            fontSize: 15,
                          }}
                          bold
                          isTruncated
                        >
                          {bookingDetail.customerRoute.startStation.name}
                        </Text>
                      </VStack>
                    </HStack>
                  </HStack>
                  <Divider
                    _light={{
                      bg: "gray.300",
                    }}
                    _dark={{
                      bg: "muted.50",
                    }}
                  />
                  <HStack alignItems="center">
                    <HStack alignSelf="flex-start" justifyContent="center">
                      <VStack alignSelf="center">
                        <MapPinIcon size={25} color="#00A1A1" />
                      </VStack>

                      <VStack alignItems="flex-start" justifyContent="center">
                        <Text style={styles.title}>Điểm đến</Text>
                        <Text
                          style={{
                            paddingLeft: 5,
                            paddingBottom: 5,
                            fontSize: 15,
                          }}
                          bold
                          isTruncated
                        >
                          {bookingDetail.customerRoute.endStation.name}
                        </Text>
                      </VStack>
                    </HStack>
                  </HStack>
                </Box>
                <Text py={1} bold fontSize={25}>
                  Khoảng cách
                </Text>
                <Box
                  p={3}
                  style={[styles.cardInsideLocation, styles.shadowProp]}
                >
                  <HStack space={5} alignItems="center">
                    <Text w={160} fontSize={16} fontWeight="bold">
                      Khoảng cách:
                    </Text>
                    <Text w={50} fontSize={16}>
                      {bookingDetail.customerRoute.distance}
                    </Text>
                    <Text fontSize={16}>Km</Text>
                  </HStack>
                  <HStack space={5} alignItems="center">
                    <Text w={160} fontSize={16} fontWeight="bold">
                      Khoảng thời gian:
                    </Text>
                    <Text w={50} fontSize={16}>
                      {bookingDetail.customerRoute.duration}
                    </Text>
                    <Text fontSize={16}>Phút</Text>
                  </HStack>
                </Box>
                <VStack my={1}>
                  <Text bold fontSize={25} pr={5}>
                    Lộ trình đi
                  </Text>
                  <Box
                    alignSelf="flex-end"
                    borderWidth="1"
                    borderColor={themeColors.primary}
                    py={2}
                    px={1}
                    borderRadius={10}
                  >
                    <HStack alignSelf="flex-end">
                      {bookingDetail.customerRoute.type == "ONE_WAY" ? (
                        <ArrowSmallRightIcon
                          size={25}
                          alignSelf="center"
                          color="black"
                        />
                      ) : (
                        <ArrowsRightLeftIcon
                          size={25}
                          alignSelf="center"
                          color="black"
                        />
                      )}
                      <Text p={1} bold mr={3}>
                        {bookingDetail.customerRoute.type == "ONE_WAY"
                          ? "Một chiều"
                          : "Hai chiều"}
                      </Text>
                      <CalendarDaysIcon
                        size={25}
                        alignSelf="center"
                        color="black"
                      />
                      <Text p={1} bold>
                        {bookingDetail.customerRoute.routineType == "WEEKLY"
                          ? "Theo tuần"
                          : "Theo tháng"}
                      </Text>
                    </HStack>
                  </Box>
                </VStack>

                <Box
                  style={[
                    styles.cardInsideDateTime,
                    styles.shadowProp,
                    { width: "100%", height: 300 },
                  ]}
                >
                  <Tab.Navigator
                    tabBar={(props) => renderTabBar(props)}
                    screenOptions={({ route }) => ({
                      lazy: true, // Tự động chuyển lazy thành true
                    })}
                    // sceneContainerStyle={{ flex: 1 }}
                  >
                    <Tab.Screen
                      name="Đã có tài xế"
                      children={({ navigation }) => (
                        <OnGoingScreen
                          id={bookingDetail.id}
                          navigation={navigation}
                          setIsLoading={setIsGoingLoading}
                          isLoading={isGoingLoading}
                        />
                      )}
                    />
                    <Tab.Screen
                      name="Đang đợi"
                      children={({ navigation }) => (
                        <PendingScreen
                          id={bookingDetail.id}
                          navigation={navigation}
                          setIsLoading={setIsPendingLoading}
                          isLoading={isPendingLoading}
                        />
                      )}
                    />
                    <Tab.Screen
                      name="Lịch sử"
                      children={({ navigation }) => (
                        <HistoryScreen
                          id={bookingDetail.id}
                          navigation={navigation}
                          setIsLoading={setIsHistoryLoading}
                          isLoading={isHistoryLoading}
                        />
                      )}
                    />
                    <Tab.Screen
                      name="Đã hủy"
                      children={({ navigation }) => (
                        <CancelScreen
                          id={bookingDetail.id}
                          navigation={navigation}
                          setIsLoading={setIsCancelLoading}
                          isLoading={isCancelLoading}
                        />
                      )}
                    />
                  </Tab.Navigator>
                </Box>
              </VStack>
            </Box>
          )}
        </ScrollView>
      </View>

      {/* <Box borderRadius={8} backgroundColor="#00A1A1" my={5} w="83%" alignSelf="center" alignItems="center">
                <Button onPress={handlePickBooking} backgroundColor="#00A1A1">Nhận chuyến</Button>
            </Box> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: "100%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flexDirection: "column", // inner items will be added vertically
    flexGrow: 1, // all the available vertical space will be occupied by it
    justifyContent: "space-between", // will create the gutter between body and footer
  },
  cardInsideDateTime: {
    backgroundColor: "white",
    borderRadius: 10,

    paddingHorizontal: 15,
    width: "40%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    flexGrow: 1,
    margin: 5,
  },
  cardInsideLocation: {
    backgroundColor: "white",
    borderRadius: 10,

    paddingHorizontal: 15,
    // width: "100%",
    marginVertical: 10,
    // marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 20,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  body: {
    flex: 1,
  },
  title: {
    color: themeColors.primary,
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 10,
    paddingLeft: 5,
  },
  list: {
    paddingTop: 10,
    fontSize: 20,
  },
});

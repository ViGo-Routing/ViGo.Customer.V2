import React, { useState, useEffect, useRef, useContext } from "react";
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert
} from "react-native";

import Map from "../../components/Map/Map";
// import BottomSheet from '../../components/BottomSheet/BottomSheetComponent';
import { themeColors } from "../../assets/theme/index";
import { CommonActions, useNavigation } from "@react-navigation/native";
import InputCard from "../../components/Card/InputCard";
import SwtichVehicle from "../../components/Select Box/SwitchVehicle";
import {
  ArrowLeftIcon,
  RocketLaunchIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  ClockIcon,
} from "react-native-heroicons/solid";
import {
  Box,
  Text,
  Button,
  HStack,
  VStack,
  useToast,
  Divider,
} from "native-base";
import { SwipeablePanel } from "../../components/SwipeablePanel/Panel";
import DetailCard from "../../components/Card/DetailCard";
import { getVehicleTypeById } from "../../service/vehicleTypeService";
import {
  createFareCalculate,
  updateBookingById,
} from "../../service/bookingService";
import { getRouteById } from "../../service/routeService";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";

const UpdateBookingScreen = (props) => {
  const navigation = useNavigation();

  const [selectedOption, setSelectedOption] = useState(null);
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const pickup = props.route.params.pickupPosition;
  const destination = props.route.params.destinationPosition;
  const routeType = props.route.params.type;
  const routineType = props.route.params.routineType;
  const pickupTime = props.route.params.pickupTime;
  const pickupBackTime = props.route.params.pickupBackTime;
  const routines = props.route.params.routines;
  const roundTrip = props.route.params.roundTrip;
  const type = props.route.params.type;
  const startDay = props.route.params.startDay;
  const daysOfWeek = props.route.params.daysOfWeek;
  const bookingId = props.route.params.bookingId;

  console.log("startDay", startDay);
  const { user } = useContext(UserContext);
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [fareCalculation, setFareCalculation] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [pickupPosition, setPickupPosition] = useState(pickup);
  const [destinationPosition, setDestinationPosition] = useState(destination);
  const [routeId, setRouteId] = useState("");
  const [route, setRoute] = useState("");
  const [vnDays, setVnDays] = useState(null);
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const currentDate = new Date();
  const panelRef = useRef(null);

  const handlePlaceSelection = (details) => {
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
    setRouteId(data);
  };

  const formatMoney = (money) => {
    const formattedCurrency =
      (money / 1000).toLocaleString("vi-VN", { minimumFractionDigits: 0 }) +
      ".000 VND";
    return formattedCurrency;
  };
  const convertToVietnameseWeekdays = (englishWeekdays) => {
    const weekdaysMap = {
      Monday: "Thứ 2 ",
      Tuesday: "Thứ 3 ",
      Wednesday: "Thứ 4 ",
      Thursday: "Thứ 5 ",
      Friday: "Thứ 6 ",
      Saturday: "Thứ 7 ",
      Sunday: "Chủ nhật ",
    };

    const vietnameseWeekdays = englishWeekdays.map((weekday) => {
      const dayNumber = weekdaysMap[weekday].split(" ")[1];
      return `${weekdaysMap[weekday]}`;
    });
    const result = vietnameseWeekdays.join(", ");
    setVnDays(result);
    return vietnameseWeekdays.join(", ");
  };
  useEffect(() => {
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

    if (pickupPosition && destinationPosition) {
      fetchDirections();
    }
  }, [pickupPosition, destinationPosition]);
  useEffect(() => {
    const fetchData = async () => {
      const dataResponse = {
        vehicleTypeId: "2788f072-56cd-4fa6-a51a-79e6f473bf9f",
        beginTime: pickupTime,
        distance: distance,
        duration: duration,
        totalNumberOfTickets: routeType != "ROUND_TRIP" ? routines.routeRoutines.length : (routines.routeRoutines.length * 2),
        tripType: routeType,
        routineType: routineType,
        roundTripBeginTime:
          pickupBackTime === null ? pickupTime : pickupBackTime,
      };
      setRoute(dataResponse);
      //handelPosition(result.data)
      // setPickupPosition(result.data.startStation)
      // setDestinationPosition(result.data.endStation)
      console.log("setFareCalculation");
      await createFareCalculate(dataResponse).then((response) => {
        setFareCalculation(response);
      });
      await getVehicleTypeById(dataResponse.vehicleTypeId).then((response) => {
        console.log("vihecle", response.data);
        setVehicle(response.data);
      });
    };

    if (duration !== "" && distance !== "") {
      fetchData();
    }
    convertToVietnameseWeekdays(daysOfWeek);
  }, [duration, distance]);

  const formatDateString = (date) => {
    if (date) {
      const dateObj = new Date(date);
      const day = dateObj.getDate().toString().padStart(2, "0");
      const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
      const year = dateObj.getFullYear().toString();

      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate; // Output: 25/07/2023
    } else {
      console.log("Date is undefined or null");
      return "";
    }
  };
  const updateBooking = async () => {
    try {
      console.log("routeRoutines", type);
      let routeId = routines.routeId;
      let routeRoutines = routines.routeRoutines;
      let roundTripRoutines = null
      if (routeType == "ROUND_TRIP") {
        roundTripRoutines = roundTrip.routeRoutines;
      }

      const requestData = {
        // Request body data
        routeId: routeId,
        userId: user.id,
        name: `${pickupPosition.name} - ${destinationPosition.name}`,
        distance: distance,
        duration: duration,
        status: "ACTIVE",
        routineType: routineType,
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
        routeRoutines: routeRoutines,
        roundTripRoutines: roundTripRoutines,
        bookingUpdate: {
          bookingId: bookingId,
          startDate: routines.routeRoutines[0].routineDate,
          endDate: routines.routeRoutines[routeRoutines.length - 1].routineDate,
          daysOfWeek: vnDays,
          totalPrice: (fareCalculation?.finalFare + fareCalculation?.roundTripFinalFare),
          priceAfterDiscount: 0,
          isShared: true,
          duration: duration,
          distance: distance,
          roundTripTotalPrice: fareCalculation?.roundTripFinalFare,
        },
      };

      Alert.alert("Xác nhận", "Bạn có muốn cập nhật theo lịch trình này!", [
        {
          text: "Không",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Có",
          onPress: async () => {
            try {
              setIsLoading(true)
              await updateBookingById(bookingId, requestData).then(
                (response) => {
                  if (response != null) {
                    setIsLoading(false)
                    Alert.alert(
                      "Hoàn Thành",
                      "Bạn vừa hoàn tất cập nhật lại chuyến xe định kì, hãy đợi chúng tôi tìm tài xế thích hợp cho bạn nhé!",
                      [
                        {
                          text: "Tiếp tục",
                          onPress: () =>
                            navigation.dispatch(
                              CommonActions.reset({
                                index: 0,
                                routes: [{ name: "Home" }],
                              })
                            ),
                        },
                      ],
                      { cancelable: false }
                    );
                  }
                }
              );
            } catch (error) {
              console.error("Error creating booking:", error);
            }
          },
        },
      ]);
    } catch (error) {
      console.log("routines.routeRoutines", error);
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
  const renderSmallTripInformation = () => {
    return (
      <Box>
        <VStack p={2}>
          <HStack justifyContent="space-between">
            <Text fontSize={15} bold>
              Giá gốc:{" "}
            </Text>
            <Text fontSize={15}>
              {formatMoney(fareCalculation?.originalFare)}
            </Text>
          </HStack>

          <HStack justifyContent="space-between">
            <Text fontSize={15} bold>
              Phụ phí:{" "}
            </Text>
            <Text fontSize={15}>
              {formatMoney(fareCalculation?.additionalFare)}
            </Text>
          </HStack>

          <HStack justifyContent="space-between">
            <Text fontSize={15} bold>
              Tổng tiền:{" "}
            </Text>
            <Text fontSize={15}>{formatMoney(fareCalculation?.finalFare)}</Text>
          </HStack>
        </VStack>
        <Button bg={themeColors.primary} onPress={updateBooking}>
          <Text style={styles.buttonWhiteText}>Cập nhật</Text>
        </Button>
      </Box>
    );
  };

  const renderFullTripInformation = () => {
    return (
      <Box>
        <View style={styles.cardInsideDateTime} m={2}>
          <VStack justifyContent="space-evenly">
            <HStack
              my={1}
              p={1}
              borderWidth={1}
              width="100%"
              borderColor="gray.200"
              bg="white"
              borderRadius={10}
              shadow={2}
              justifyContent="space-between"
            >
              <HStack alignItems="center" justifyContent="center">
                <Box p={2}>
                  <RocketLaunchIcon size={20} color={themeColors.primary} />
                </Box>

                <VStack>
                  <Text fontSize={15} color={themeColors.primary} bold>
                    Loại xe:{" "}
                  </Text>
                  <Text fontSize={15}>
                    {vehicle?.name === null ? "" : vehicle?.name}
                  </Text>
                </VStack>
              </HStack>
              <HStack alignItems="center" justifyContent="center">
                <Box p={2}>
                  {type === null ? (
                    ""
                  ) : type === "ONE_WAY" ? (
                    <ArrowRightIcon size={20} color={themeColors.primary} />
                  ) : (
                    <ArrowsRightLeftIcon
                      size={20}
                      color={themeColors.primary}
                    />
                  )}
                </Box>

                <VStack>
                  <Text fontSize={15} color={themeColors.primary} bold>
                    Loại Chuyến:{" "}
                  </Text>
                  <Text fontSize={15}>
                    {type === null
                      ? ""
                      : type === "ONE_WAY"
                        ? "Một chiều"
                        : "Hai chiều"}
                  </Text>
                </VStack>
              </HStack>
              <HStack alignItems="center" justifyContent="center">
                <Box p={2}>
                  <CalendarDaysIcon size={20} color={themeColors.primary} />
                </Box>

                <VStack>
                  <Text fontSize={15} color={themeColors.primary} bold>
                    Lịch trình:{" "}
                  </Text>
                  <Text fontSize={15}>
                    {routeType === null
                      ? ""
                      : routineType === "WEEKLY"
                        ? "Mỗi tuần"
                        : "Mỗi tháng"}
                  </Text>
                </VStack>
              </HStack>
            </HStack>
            <HStack my={1} p={1} justifyContent="space-between">
              <HStack
                borderWidth={1}
                width="49%"
                bg="white"
                borderColor="gray.200"
                borderRadius={10}
                shadow={2}
                alignItems="center"
                justifyContent="center"
              >
                <Box p={2}>
                  <CalendarIcon size={20} color={themeColors.primary} />
                </Box>

                <VStack>
                  <Text fontSize={15} color={themeColors.primary} bold>
                    Ngày bắt đầu:{" "}
                  </Text>
                  <Text fontSize={15}>
                    {routines === null
                      ? ""
                      : formatDateString(routines.routeRoutines[0].routineDate)}
                  </Text>
                </VStack>
              </HStack>
              <HStack
                borderWidth={1}
                width="49%"
                borderColor="gray.200"
                bg="white"
                borderRadius={10}
                shadow={2}
                alignItems="center"
                justifyContent="center"
              >
                <Box p={2}>
                  <ClockIcon size={20} color={themeColors.primary} />
                </Box>

                <VStack>
                  <Text fontSize={15} color={themeColors.primary} bold>
                    Giờ đón:{" "}
                  </Text>
                  <Text fontSize={15}>
                    {pickupTime === null ? "" : pickupTime}
                  </Text>
                </VStack>
              </HStack>
            </HStack>

            <VStack p={2}>
              <HStack justifyContent="space-between">
                <Text fontSize={15} bold>
                  Ngày trong tuần:{" "}
                </Text>
                <Text fontSize={15}>
                  {routines === null
                    ? ""
                    : formatDateString(routines.routeRoutines[0].routineDate)}
                </Text>
              </HStack>

              <HStack justifyContent="space-between">
                <Text fontSize={15} bold>
                  Ngày đặt:{" "}
                </Text>
                <Text fontSize={15}>
                  {pickupTime === null ? "" : pickupTime}
                </Text>
              </HStack>

              <HStack justifyContent="space-between">
                <Text fontSize={15} bold>
                  Số ngày đi:{" "}
                </Text>
                <Text fontSize={15}>
                  {routines === null ? "" : routines.routeRoutines.length}
                </Text>
              </HStack>
            </VStack>
          </VStack>

          {/* <DetailCard title="Loại xe" info={vehicle?.name === null ? "" : vehicle?.name} /> */}
          {/* <DetailCard
                        title="Loại Chuyến"
                        info={routineType === null ? "" : (routineType === "ONE_WAY" ? "Một chiều" : "Hai chiều")}
                    /> */}
          {/* <DetailCard title="Ngày bắt đầu" info={routines === null ? "" : formatDateString(routines.routeRoutines[0].routineDate)} />
                    <DetailCard title="Giờ đi" info={pickupTime === null ? "" : pickupTime} /> */}
          {/* <DetailCard title="Ngày trong tuần" info={vnDays === null ? "" : vnDays} />
                    <DetailCard title="Ngày đặt" info={currentDate === null ? "" : formatDateString(currentDate)} />
                    <DetailCard title="Số ngày đi" info={routines === null ? "" : routines.routeRoutines.length} /> */}
        </View>
        <Divider
          my="2"
          _light={{
            bg: "muted.800",
          }}
          _dark={{
            bg: "muted.50",
          }}
        />
        <View style={styles.cardInsideDateTime} m={2}>
          <VStack p={2}>
            <HStack justifyContent="space-between">
              <Text fontSize={15} bold>
                Giá gốc:{" "}
              </Text>
              <Text fontSize={15}>
                {formatMoney(fareCalculation?.originalFare)}
              </Text>
            </HStack>

            <HStack justifyContent="space-between">
              <Text fontSize={15} bold>
                Phụ phí:{" "}
              </Text>
              <Text fontSize={15}>
                {formatMoney(fareCalculation?.additionalFare)}
              </Text>
            </HStack>

            <HStack justifyContent="space-between">
              <Text fontSize={15} bold>
                Tổng tiền:{" "}
              </Text>
              <Text fontSize={15}>
                {formatMoney(fareCalculation?.finalFare)}
              </Text>
            </HStack>
          </VStack>
          {/* <DetailCard title="Giá gốc" info={formatMoney(fareCalculation?.originalFare)} />
                    <DetailCard title="Tổng tiền" info={formatMoney(fareCalculation?.finalFare)} /> */}
        </View>
        <Button bg={themeColors.primary} onPress={updateBooking}>
          <Text bold fontSize={20} color="white">
            Cập nhật
          </Text>
        </Button>
      </Box>
    );
  };
  const windowHeight = Dimensions.get("window").height;
  const bottomSlideHeight = windowHeight * 0.3;

  return (
    <View style={styles.container}>
      <ViGoSpinner isLoading={isLoading} />
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
      <Box>
        <SwipeablePanel
          isActive={true}
          fullWidth={true}
          noBackgroundOpacity
          // showCloseButton
          allowTouchOutside
          smallPanelItem={<Box px="6">{renderSmallTripInformation()}</Box>}
          smallPanelHeight={300}
          // openLarge={openLargePanel}
          ref={panelRef}
          largePanelHeight={500}
        // onlySmall
        >
          {<Box px="6">{renderFullTripInformation()}</Box>}
        </SwipeablePanel>
      </Box>
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

export default UpdateBookingScreen;

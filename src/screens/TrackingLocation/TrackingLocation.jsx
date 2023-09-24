import React, { useContext, useEffect, useRef, useState } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import SignalRService from "../../utils/signalRUtils"; // Adjust the path
import { UserContext } from "../../context/UserContext";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  FlagIcon,
  MapPinIcon,
  PhoneIcon,
  RocketLaunchIcon,
  UserCircleIcon,
  UserIcon,
} from "react-native-heroicons/solid";
import { themeColors } from "../../assets/theme/index";
import {
  Alert,
  Avatar,
  Box,
  Center,
  CloseIcon,
  Divider,
  HStack,
  IconButton,
  Pressable,
  Spinner,
  Text,
  VStack,
} from "native-base";
import Header from "../../components/Header/Header";
import MapViewDirections from "react-native-maps-directions";
import { SwipeablePanel } from "../../components/SwipeablePanel/Panel";
import { getBookingDetailById } from "../../service/bookingService";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import { Animated } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import DriverInformationCard from "../../components/Card/DriverInformationCard";
import ReportModal from "../../components/Modal/ReportModal";
const TrackingLocationScreen = ({}) => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingDetailId } = route.params;
  const customerId = `${user.id}`; // Replace with actual customer ID
  const tripId = bookingDetailId; // Replace with actual trip ID

  const [driverLocation, setDriverLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [customerLocation, setCustomerLocation] = useState(null); // Initialize as null
  const [bookingDetail, setBookingDetail] = useState(null); // Initialize as null
  const slideUp = new Animated.Value(0);
  const slideUpHandler = () => {
    Animated.timing(slideUp, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  const panelRef = useRef(null);
  useEffect(() => {
    SignalRService.registerCustomer(tripId);
    const locationTrackingListener = SignalRService.onLocationTracking(
      (latitude, longitude) => {
        setDriverLocation({ latitude, longitude });
      }
    );
    loadBookingDetailWithId();

    const focus_unsub = navigation.addListener("focus", () => {
      loadBookingDetailWithId();
      slideUpHandler();
    });
    const locationUpdateInterval = setInterval(() => {
      Geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(latitude, longitude);
          setCustomerLocation({ latitude, longitude });
        },
        (error) => console.error(error),
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
      );
    }, 3000);
    return () => {
      focus_unsub();
      locationTrackingListener && locationTrackingListener.off(); // Check if the listener exists
      clearInterval(locationUpdateInterval);
      slideUpHandler();
    };
  }, []);

  loadBookingDetailWithId = () => {
    getBookingDetailById(tripId).then((response) => {
      setBookingDetail(response.data);
    });
  };

  let calculatedRegion = null;
  if (
    customerLocation &&
    driverLocation.latitude !== 0 &&
    driverLocation.longitude !== 0
  ) {
    calculatedRegion = {
      latitude: (driverLocation.latitude + customerLocation.latitude) / 2,
      longitude: (driverLocation.longitude + customerLocation.longitude) / 2,
      latitudeDelta:
        Math.abs(driverLocation.latitude - customerLocation.latitude) * 1.5,
      longitudeDelta:
        Math.abs(driverLocation.longitude - customerLocation.longitude) * 1.5,
    };
  }
  const renderSmallTripInformation = () => {
    return (
      <Box>
        <View style={styles.card}>
          <Box>
            <VStack>
              {bookingDetail != null && (
                <HStack my={1} alignItems="center" justifyContent="flex-start">
                  <Box pr={2}>
                    <MapPinIcon size={30} color={themeColors.primary} />
                  </Box>

                  <VStack w="95%">
                    <Text fontSize={15} color="black" bold>
                      Điểm đi:{" "}
                    </Text>
                    <Text fontSize={15}>
                      {bookingDetail.startStation.address}
                    </Text>
                  </VStack>
                </HStack>
              )}
              {/* <Divider
                    my="2"
                    _light={{
                      bg: "muted.800",
                    }}
                    _dark={{
                      bg: "muted.50",
                    }}
                  /> */}
              {bookingDetail != null && (
                <HStack my={1} alignItems="center" justifyContent="flex-start">
                  <Box pr={2}>
                    <MapPinIcon size={30} color={themeColors.primary} />
                  </Box>

                  <VStack w="95%">
                    <Text fontSize={15} color="black" bold>
                      Điểm đến:{" "}
                    </Text>
                    <Text fontSize={15}>
                      {bookingDetail.endStation.address}
                    </Text>
                  </VStack>
                </HStack>
              )}
            </VStack>
          </Box>
        </View>
      </Box>
    );
  };

  const renderFullTripInformation = () => {
    return (
      <Box>
        <View m={2}>
          {bookingDetail == null ? (
            <Spinner color={themeColors.primary} />
          ) : (
            <VStack justifyContent="space-evenly">
              <Box p={2}>
                <VStack>
                  {bookingDetail != null && (
                    <HStack
                      my={1}
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Box pr={2}>
                        <MapPinIcon size={30} color={themeColors.primary} />
                      </Box>

                      <VStack w="95%">
                        <Text fontSize={15} color="black" bold>
                          Điểm đi:{" "}
                        </Text>
                        <Text fontSize={15}>
                          {bookingDetail.startStation.address}
                        </Text>
                      </VStack>
                    </HStack>
                  )}
                  {/* <Divider
                    my="2"
                    _light={{
                      bg: "muted.800",
                    }}
                    _dark={{
                      bg: "muted.50",
                    }}
                  /> */}
                  {bookingDetail != null && (
                    <HStack
                      my={1}
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Box pr={2}>
                        <MapPinIcon size={30} color={themeColors.primary} />
                      </Box>

                      <VStack w="95%">
                        <Text fontSize={15} color="black" bold>
                          Điểm đến:{" "}
                        </Text>
                        <Text fontSize={15}>
                          {bookingDetail.endStation.address}
                        </Text>
                      </VStack>
                    </HStack>
                  )}
                </VStack>
              </Box>
              {bookingDetail != null && (
                <Box mt="3" p={3}>
                  <DriverInformationCard
                    driver={bookingDetail.driver}
                    displayDriverText={true}
                    displayCall={true}
                    bookingDetailId={bookingDetail.id}
                  />
                  <Pressable
                    style={styles.cardInsideDateTime}
                    p={2}
                    onPress={toggleModal}
                    w="40%"
                    borderWidth={1}
                    bg={themeColors.primary}
                  >
                    <HStack alignItems="center" justifyContent="space-around">
                      <FlagIcon size={25} color={themeColors.primary} />
                      <Text fontSize={18} bold color={themeColors.primary}>
                        {" "}
                        Báo cáo{" "}
                      </Text>
                    </HStack>
                  </Pressable>
                </Box>
              )}
            </VStack>
          )}
        </View>
      </Box>
    );
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <View style={{ flex: 1 }}>
      <Header title="Chi tiết" />
      {customerLocation == null &&
        driverLocation.latitude === 0 &&
        driverLocation.longitude === 0 && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text bold p={1}>
              Đang tải
            </Text>

            <Spinner color={themeColors.primary} />
          </View>
        )}
      {customerLocation != null &&
        driverLocation.latitude !== 0 &&
        driverLocation.longitude !== 0 && ( // Only render map when customerLocation is available
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: customerLocation.latitude,
              longitude: customerLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <MapViewDirections
              origin={{
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
              }}
              destination={{
                latitude: customerLocation.latitude,
                longitude: customerLocation.longitude,
              }}
              apikey="AIzaSyCIYCycKF24mQXN1pJYFfCO-6azSETj_Qc"
              strokeWidth={3}
              strokeColor="#00A1A1"
              mode="motobike"
              //onReady={handleDirectionsReady}
            />

            <Marker
              coordinate={{
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
              }}
              title="Driver"
              icon={require("../../assets/icons/vigobike.png")}
            />
            <Marker
              coordinate={{
                latitude: customerLocation.latitude,
                longitude: customerLocation.longitude,
              }}
              title="Customer"
            >
              <MapPinIcon width={32} height={32} fill={themeColors.primary} />
            </Marker>
          </MapView>
        )}
      {customerLocation != null &&
        driverLocation.latitude !== 0 &&
        driverLocation.longitude !== 0 && (
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
            <ReportModal
              bookingDetailId={bookingDetail.id}
              isOpen={isModalOpen}
              onClose={toggleModal}
            />
          </Box>
        )}
    </View>
  );
};
const styles = StyleSheet.create({
  cardInsideDateTime: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 10,

    paddingHorizontal: 5,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "column",
    flexGrow: 1,
    margin: 5,
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
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
export default TrackingLocationScreen;

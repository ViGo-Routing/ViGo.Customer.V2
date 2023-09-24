import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
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
import { useNavigation } from "@react-navigation/native";
import DriverInformationCard from "../../components/Card/DriverInformationCard";
import ReportModal from "../../components/Modal/ReportModal";
const TrackingOnGoingLocationScreen = ({ route }) => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const { bookingDetailId } = route.params;
  const customerId = `${user.id}`; // Replace with actual customer ID
  const tripId = bookingDetailId; // Replace with actual trip ID

  const [customerLocation, setCustomerLocation] = useState(null); // Initialize as null
  const [bookingDetail, setBookingDetail] = useState(null); // Initialize as null
  const panelRef = useRef(null);
  const slideUp = new Animated.Value(0);
  const slideUpHandler = () => {
    Animated.timing(slideUp, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
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

    getBookingDetailById();
    const focus_unsub = navigation.addListener("focus", () => {
      loadBookingDetailWithId();
    });
    slideUpHandler();

    return () => {
      focus_unsub();
      clearInterval(locationUpdateInterval);
      slideUpHandler();
    };
  }, []);

  loadBookingDetailWithId = () => {
    getBookingDetailById(tripId).then((response) => {
      setBookingDetail(response.data);
    });
  };

  const renderSmallTripInformation = () => {
    return (
      <Box>
        <View m={2}>
          <Box m={2}>
            <VStack>
              {bookingDetail != null && (
                <HStack my={1} alignItems="center" justifyContent="flex-start">
                  <Box p={2}>
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
                  <Box p={2}>
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const renderFullTripInformation = () => {
    return (
      <Box>
        <View m={2}>
          {bookingDetail == null ? (
            <Spinner color={themeColors.primary} />
          ) : (
            <VStack justifyContent="space-evenly">
              <Box py={3}>
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
              {/* <VStack my={1} p={1} justifyContent="space-between">
                                <HStack
                                    borderWidth={1}
                                    width="100%"
                                    bg="white"
                                    borderColor="gray.200"
                                    borderRadius={10}
                                    shadow={2}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Box p={2}>
                                        <Avatar
                                            size="lg"
                                            source={{
                                                uri: `${bookingDetail.driver.avatarUrl}`, // Replace with the actual avatar URL
                                            }}
                                        />
                                    </Box>

                                    <VStack>
                                        <Text fontSize={15} color={themeColors.primary} bold>
                                            Tài xế:{" "}
                                        </Text>
                                        <Text fontSize={15}>
                                            {bookingDetail.driver.name}
                                        </Text>
                                    </VStack>
                                </HStack>
                                <HStack
                                    borderWidth={1}
                                    width="100%"
                                    borderColor="gray.200"
                                    bg="white"
                                    borderRadius={10}
                                    shadow={2}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Box p={2}>
                                        <PhoneIcon size={20} color={themeColors.primary} />
                                    </Box>

                                    <VStack>
                                        <Text fontSize={15} color={themeColors.primary} bold>
                                            Số điện thoại:{" "}
                                        </Text>
                                        <Text fontSize={15}>
                                            {bookingDetail.driver.phone}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </VStack> */}
              <DriverInformationCard
                driver={bookingDetail.driver}
                displayDriverText={true}
                displayCall={true}
                bookingDetailId={bookingDetail.id}
              />
              <Pressable onPress={toggleModal}>
                <FlagIcon size={25} color={themeColors.primary} />
              </Pressable>
            </VStack>
          )}
        </View>
      </Box>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Chi tiết" />
      {customerLocation == null && bookingDetail == null && (
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
        bookingDetail != null && ( // Only render map when customerLocation is available
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
                latitude: bookingDetail.endStation.latitude,
                longitude: bookingDetail.endStation.longitude,
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
                latitude: customerLocation.latitude,
                longitude: customerLocation.longitude,
              }}
              title="Driver"
              icon={require("../../assets/icons/vigobike.png")}
            />
            <Marker
              coordinate={{
                latitude: bookingDetail.endStation.latitude,
                longitude: bookingDetail.endStation.longitude,
              }}
              title="Customer"
            >
              <MapPinIcon width={32} height={32} fill={themeColors.primary} />
            </Marker>
          </MapView>
        )}
      {customerLocation != null && (
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
export default TrackingOnGoingLocationScreen;

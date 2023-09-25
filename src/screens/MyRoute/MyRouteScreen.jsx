import React, { useContext, useEffect, useRef, useState } from "react";
import { BackHandler, NativeEventEmitter, StyleSheet } from "react-native";
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
  XCircleIcon,
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
  ScrollView,
  Spinner,
  Text,
  VStack,
  View,
} from "native-base";
import Header from "../../components/Header/Header";
import MapViewDirections from "react-native-maps-directions";
import { SwipeablePanel } from "../../components/SwipeablePanel/Panel";
import {
  getBookingById,
  getBookingDetailById,
} from "../../service/bookingService";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import { Animated } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import DriverInformationCard from "../../components/Card/DriverInformationCard";
import ReportModal from "../../components/Modal/ReportModal";
import NewHeader from "../../components/Header/NewHeader";
import { toVnDateString, toVnDateTimeString } from "../../utils/datetimeUtils";
import { eventNames } from "../../utils/alertUtils";
import { cancelBookingDetail } from "../../service/bookingDetailService";
import ConfirmAlert from "../../components/Alert/ConfirmAlert";
import { vndFormat } from "../../utils/numberUtils";
const MyRouteScreen = ({ }) => {
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
  const [booking, setBooking] = useState(null); // Initialize as null
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [cancelFee, setCancelFee] = useState(0);
  const slideUp = new Animated.Value(0);
  const handleConfirmCancelTrip = async () => {
    // const bookingId = bookingDetail.bookingId;
    const eventEmitter = new NativeEventEmitter();
    try {
      setIsLoading(true);
      const response = await cancelBookingDetail(bookingDetail.id);
      if (response) {
        eventEmitter.emit(eventNames.SHOW_TOAST, {
          // title: "Xác nhận chuyến đi",
          title: "Hủy chuyến thành công!",
          description: "",
          status: "success",
          // placement: "top",
          // isDialog: true,
          isSlide: true,
          duration: 5000,
        });
        // navigation.navigate("Schedule", { date: bookingDetail.date });
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Home",
              // params: {
              //   bookingDetailId: bookingDetail.id,
              // },
            },
          ],
        });
      }
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
    } finally {
      setIsLoading(false);
    }
  };
  const openConfirmCancelTrip = async () => {
    try {
      setIsLoading(true);
      const bookingDetailId = item.id;
      const cancelFee = await getCancelFee(bookingDetailId);
      setCancelFee(cancelFee);
      setIsCancelConfirmOpen(true);
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
    } finally {
      setIsLoading(false);
    }
  };
  const CancelBookingDetailConfirmAlert = ({
    // item,
    // items,
    cancelFee,
    handleOkPress,
    confirmOpen,
    setConfirmOpen,
    // key,
  }) => {
    const description = () => {
      return (
        <VStack>
          <Text>
            Với việc hủy chuyến xe, bạn sẽ phải chịu một khoản phí hủy chuyến
            (nếu có) tùy vào thời gian và chuyến xe mà bạn hủy.
          </Text>
          <Text>
            Phí trả trước cho chuyến đi (sau khi đã trừ phí hủy chuyến) sẽ được
            hoàn về ví của bạn sau khi hủy chuyến thành công.
          </Text>
          <Text marginTop="2">
            Phí hủy chuyến tạm tính: <Text bold>{vndFormat(cancelFee)}</Text>
          </Text>
        </VStack>
      );
    };

    return (
      <ConfirmAlert
        title="Huỷ chuyến xe"
        description={description()}
        okButtonText="Xác nhận"
        cancelButtonText="Hủy"
        onOkPress={() => handleOkPress()}
        isOpen={confirmOpen}
        setIsOpen={setConfirmOpen}
        key={`confirm-cancel-booking-detail-alert`}
      />
    );
  };
  const slideUpHandler = () => {
    Animated.timing(slideUp, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  const panelRef = useRef(null);
  useEffect(() => {
    const focus_unsub = navigation.addListener("focus", () => {
      loadBookingDetailWithId();
      slideUpHandler();
    });

    return () => {
      focus_unsub();
      slideUpHandler();
    };
  }, []);

  loadBookingDetailWithId = () => {
    getBookingDetailById(tripId).then((response) => {
      setBookingDetail(response.data);
      getBookingById(response.data.bookingId).then((response) => {
        setBooking(response.data);
      });
    });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formatMoney = (money) => {
    console.log(money);
    const formattedCurrency =
      (money / 1000).toLocaleString("vi-VN", { minimumFractionDigits: 0 }) +
      ".000 VND";
    console.log(formattedCurrency);
    return formattedCurrency;
  };
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <View flex={1} bg="white">
      <ScrollView>
        <Header title="Chi tiết chuyến đi" />
        <Box>
          {bookingDetail == null && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text bold p={1}>
                Đang tải
              </Text>

              <Spinner color={themeColors.primary} />
            </View>
          )}
          {bookingDetail != null && ( // Only render map when customerLocation is available
            <VStack justifyContent="space-evenly">
              <Box p={2}>
                <VStack>
                  {bookingDetail != null && (
                    <Box>
                      {bookingDetail.driver != null && (<Box mt="3" style={styles.cardInsideDateTime} p={3}>
                        <DriverInformationCard
                          driver={bookingDetail.driver}
                          displayDriverText={true}
                          displayCall={true}
                          bookingDetailId={bookingDetail.id}
                        />
                      </Box>)}

                      <Box mt="3" style={styles.cardInsideDateTime} p={3}>
                        <Text pt={1} fontSize={20} color="black" bold>
                          Mã chuyến đi
                        </Text>
                        <Text fontSize={15} color="black" bold>
                          {bookingDetail.id}
                        </Text>
                        <Text py={2} fontSize={15} color="black">
                          {toVnDateTimeString(bookingDetail.date)}
                        </Text>
                        {booking != null && (
                          <HStack
                            p={2}
                            bg="gray.100"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <VStack
                              alignContent="center"
                              justifyContent="center"
                            >
                              <Text
                                fontSize={15}
                                alignSelf="center"
                                color="black"
                                bold
                              >
                                {booking.distance} Km
                              </Text>
                              <Text fontSize={15} color="black">
                                Quãng đường
                              </Text>
                            </VStack>
                            <Divider
                              bg="gray.300"
                              thickness="2"
                              h="50%"
                              mx="2"
                              orientation="vertical"
                            />
                            <VStack
                              alignContent="center"
                              justifyContent="center"
                            >
                              <Text
                                fontSize={15}
                                alignSelf="center"
                                color="black"
                                bold
                              >
                                {booking.duration} Phút
                              </Text>
                              <Text fontSize={15} color="black">
                                Thời gian di chuyển
                              </Text>
                            </VStack>
                            <Divider
                              bg="gray.200"
                              thickness="2"
                              mx="2"
                              orientation="vertical"
                            />
                            <VStack
                              alignContent="center"
                              justifyContent="center"
                            >
                              <Text
                                fontSize={15}
                                alignSelf="center"
                                color="black"
                                bold
                              >
                                {bookingDetail.customerRouteRoutine.pickupTime}
                              </Text>
                              <Text fontSize={15} color="black">
                                Thời gian rước
                              </Text>
                            </VStack>
                          </HStack>
                        )}
                        <HStack
                          my={1}
                          alignItems="center"
                          justifyContent="flex-start"
                        >
                          <Box pr={2}>
                            <MapPinIcon size={30} color={themeColors.primary} />
                          </Box>

                          <VStack w="90%">
                            <Text fontSize={15} color="black" bold>
                              Điểm đi:{" "}
                            </Text>
                            <Text fontSize={15}>
                              {bookingDetail.startStation.address}
                            </Text>
                          </VStack>
                        </HStack>
                        <HStack
                          my={1}
                          alignItems="center"
                          justifyContent="flex-start"
                        >
                          <Box pr={2}>
                            <MapPinIcon size={30} color={themeColors.primary} />
                          </Box>

                          <VStack w="90%">
                            <Text fontSize={15} color="black" bold>
                              Điểm đến:{" "}
                            </Text>
                            <Text fontSize={15}>
                              {bookingDetail.endStation.address}
                            </Text>
                          </VStack>
                        </HStack>
                      </Box>

                      <Box mt="3" style={styles.cardInsideDateTime} p={3}>
                        <Text py={1} fontSize={20} color="black" bold>
                          Thanh toán
                        </Text>
                        <HStack py={1} justifyContent="space-between">
                          <Text fontSize={20}>Cước phí</Text>
                          <Text fontSize={20}>
                            {" "}
                            {formatMoney(bookingDetail.price)}
                          </Text>
                        </HStack>
                      </Box>
                      <HStack>
                        <Pressable
                          style={styles.cardInsideDateTime}
                          p={2}
                          onPress={toggleModal}
                          w="40%"
                          borderWidth={1}
                          bg={themeColors.primary}
                        >
                          <HStack
                            alignItems="center"
                            justifyContent="space-around"
                          >
                            <FlagIcon size={25} color={themeColors.primary} />
                            <Text
                              fontSize={18}
                              bold
                              color={themeColors.primary}
                            >
                              {" "}
                              Báo cáo{" "}
                            </Text>
                          </HStack>
                        </Pressable>
                        <Pressable
                          style={styles.cardInsideDateTime}
                          p={2}
                          onPress={openConfirmCancelTrip}
                          w="40%"
                          borderWidth={1}
                          color={themeColors.primary}
                        >
                          <HStack
                            alignItems="center"
                            justifyContent="space-around"
                          >
                            <XCircleIcon
                              size={25}
                              color={themeColors.primary}
                            />
                            <Text
                              fontSize={18}
                              bold
                              color={themeColors.primary}
                            >
                              {" "}
                              Hủy chuyến
                            </Text>
                          </HStack>
                        </Pressable>
                      </HStack>
                    </Box>
                  )}
                </VStack>
              </Box>
            </VStack>
          )}
          {bookingDetail != null && (
            <Box>
              <ReportModal
                bookingDetailId={bookingDetail.id}
                isOpen={isModalOpen}
                onClose={toggleModal}
              />
              <CancelBookingDetailConfirmAlert
                key={"cancel-trip-modal"}
                confirmOpen={isCancelConfirmOpen}
                setConfirmOpen={setIsCancelConfirmOpen}
                handleOkPress={() => handleConfirmCancelTrip()}
                cancelFee={cancelFee}
              />
            </Box>
          )}
        </Box>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -10, // Negative value to create shadow on top
    },
    shadowOpacity: 0, // Adjust the shadow opacity as needed
    shadowRadius: 10, // Increase the shadow radius for more blur
    elevation: 10, // On Android, you can use the elevation property
  },
  cardInsideDateTime: {
    flexGrow: 1,
    backgroundColor: "white",

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
export default MyRouteScreen;

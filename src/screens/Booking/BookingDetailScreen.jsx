import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import Header from "../../components/Header/Header";
import InputCard from "../../components/Card/InputCard";
import { themeColors, vigoStyles } from "../../assets/theme/index";
import DetailCard from "../../components/Card/DetailCard";
import { CommonActions, useNavigation } from "@react-navigation/native";
import {
  createBooking,
  createFareCalculate,
} from "../../service/bookingService";
import { getRouteById } from "../../service/routeService";
import { getVehicleTypeById } from "../../service/vehicleTypeService";
import { getWalletByUserId } from "../../service/walletService";
import { UserContext } from "../../context/UserContext";
import { MapPinIcon, UserCircleIcon } from "react-native-heroicons/solid";
import {
  Box,
  HStack,
  View,
  Text,
  VStack,
  ScrollView,
  Divider,
  Button,
} from "native-base";
import { createRoutine } from "../../service/routineService";
import { vndFormat } from "../../utils/numberUtils";
import { handleError } from "../../utils/alertUtils";
import ViewRoutinesModal from "../../components/Modal/ViewRoutinesModal";

const BookingDetailScreen = ({ route }) => {
  const { user } = useContext(UserContext);
  const {
    routines,
    roundTrip,
    data,
    dataRoundTrip,
    routeId,
    daysOfWeek,
    numberOfOccurrences,
  } = route.params;
  const currentDate = new Date();
  console.log(
    "routinesroutines",
    currentDate,
    daysOfWeek,
    data[0]?.routineDate,
    data.length,
    data[0]?.pickupTime,
    vehicle?.name,
    routeData?.tripType
  );
  const [fareCalculation, setFareCalculation] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [routeData, setRoute] = useState(null);
  const [routetype, setRouteType] = useState(null);
  const [vnDays, setVnDays] = useState(null);
  const navigation = useNavigation();

  const [pickupPosition, setPickupPosition] = useState(null);
  const [destinationPosition, setDestinationPosition] = useState(null);

  const [routinesModalVisible, setRoutinesModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getRouteById(routeId);
      if (result != null) {
        const dataResponse = {
          vehicleTypeId: "2788f072-56cd-4fa6-a51a-79e6f473bf9f",
          beginTime: data[0].pickupTime,
          distance: result.data.distance,
          duration: result.data.duration,
          totalNumberOfTickets:
            result.data.type != "ROUND_TRIP" ? data.length : data.length * 2,
          eachWeekTripsCount: daysOfWeek.length,
          totalFrequencyCount: numberOfOccurrences,
          tripType: result.data.type,
          routineType: result.data.routineType,
          roundTripBeginTime:
            dataRoundTrip != null && result.data.type == "ROUND_TRIP"
              ? dataRoundTrip[0].pickupTime
              : data[0].pickupTime,
        };
        setRouteType(result.data.type);
        setRoute(dataResponse);
        handelPosition(result.data);
        setPickupPosition(result.data.startStation);
        setDestinationPosition(result.data.endStation);
        await createFareCalculate(dataResponse).then((response) => {
          console.log("dataResponse", response);
          setFareCalculation(response);
        });
        await getVehicleTypeById(dataResponse.vehicleTypeId).then(
          (response) => {
            setVehicle(response.data);
          }
        );
      }
    };
    fetchData();
    convertToVietnameseWeekdays(daysOfWeek);
  }, [routeId]);
  const requestData = {
    customerId: user.id,
    customerRouteId: routeId,
    startDate: data[0].routineDate,
    endDate: data[data.length - 1].routineDate,
    daysOfWeek: vnDays,
    totalPrice:
      fareCalculation?.finalFare + fareCalculation?.roundTripFinalFare,
    roundTripTotalPrice: fareCalculation?.roundTripFinalFare,
    priceAfterDiscount: 0,
    additionalFare: fareCalculation?.additionalFare,
    roundTripAdditionalFare: fareCalculation?.roundTripAdditionalFare,
    isShared: true,
    duration: routeData?.duration,
    distance: routeData?.distance,
    promotionId: "",
    vehicleTypeId: "2788f072-56cd-4fa6-a51a-79e6f473bf9f",
    customerRoundTripDesiredPickupTime: data[0].pickupTime,
  };
  const handelPosition = (item) => {
    console.log(item);
    const pickupPositionLocal =
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

    const destinationPositionLocal =
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
  };
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
  const formatTime = (time) => {
    const timeOnly = time ? time.split("T")[1].slice(0, 5) : null;
    return timeOnly;
  };

  const formatMoney = (money) => {
    console.log(money);
    const formattedCurrency =
      (money / 1000).toLocaleString("vi-VN", { minimumFractionDigits: 0 }) +
      ".000 VND";
    console.log(formattedCurrency);
    return formattedCurrency;
  };
  const checkBalance = async () => {
    try {
      console.log("Xác nhận");
      await getWalletByUserId(user.id).then(async (s) => {
        const walletBalance = s.balance;
        if (
          walletBalance <
          fareCalculation?.finalFare + fareCalculation?.roundTripFinalFare
        ) {
          handleError(
            "Rất tiếc",
            `Số dư ví của bạn không đủ (${vndFormat(
              walletBalance
            )}). Bạn hãy nạp thêm số dư để tiếp tục đặt chuyến đi.`
          );
        } else {
          Alert.alert(
            "Xác nhận",
            "Bạn có muốn đặt tài xế theo lịch trình này!",
            [
              {
                text: "Không",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Có",
                onPress: async () => {
                  try {
                    const responseCreateRoutines = await createRoutine(
                      routines
                    );
                    let responseCreateRoundTrip = null;
                    if (roundTrip != null) {
                      responseCreateRoundTrip = await createRoutine(roundTrip);
                    }
                    if (
                      responseCreateRoutines != null ||
                      (responseCreateRoutines != null &&
                        responseCreateRoundTrip != null)
                    ) {
                      createBooking(requestData).then((response) => {
                        if (response != null) {
                          Alert.alert(
                            "Hoàn Thành",
                            "Bạn vừa hoàn tất đặt chuyến xe định kì, hãy đợi chúng tôi tìm tài xế thích hợp cho bạn nhé!",
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
                      });
                    }
                  } catch (error) {
                    // console.error("Error creating booking:", error);
                    handleError("Có lỗi xảy ra", error);
                  }
                },
              },
            ]
          );
        }
      });
    } catch (error) {
      // console.log("Error fetching wallet balance:", error);
      handleError("Có lỗi xảy ra", error);
    }
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

    const weekdaysSorter = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 7,
    };

    const vietnameseWeekdays = englishWeekdays
      .sort((a, b) => {
        return weekdaysSorter[a] - weekdaysSorter[b];
      })
      .map((weekday) => {
        const dayNumber = weekdaysMap[weekday].split(" ")[1];
        return `${weekdaysMap[weekday]}`;
      });
    const result = vietnameseWeekdays.join(", ");
    setVnDays(result);
    return result;
  };

  return (
    <View bg="white" style={styles.container}>
      <View>
        <Header style={styles.header} title="Chi tiết" />
      </View>
      <ScrollView>
        <View m={1}>
          <View style={styles.card}>
            <Box style={styles.cardInsideDateTime}>
              <VStack>
                <HStack alignItems="center">
                  <UserCircleIcon p={2} size={20} color="blue" />
                  {pickupPosition !== null ? (
                    <Text p={2} w={300} alignItems="center" color={"gray.500"}>
                      {pickupPosition.name}
                    </Text>
                  ) : (
                    <Text p={2} w={300} alignItems="center" color={"gray.500"}>
                      Đang tải ...
                    </Text>
                  )}
                </HStack>
                <Divider
                  my="2"
                  _light={{
                    bg: "gray.200",
                  }}
                  _dark={{
                    bg: "gray.50",
                  }}
                />
                <HStack alignItems="center">
                  <MapPinIcon p={2} size={20} color="orange" />
                  {destinationPosition !== null ? (
                    <Text p={2} w={300} alignItems="center" color={"gray.500"}>
                      {destinationPosition.name}
                    </Text>
                  ) : (
                    <Text p={2} w={300} alignItems="center" color={"gray.500"}>
                      Đang tải ...
                    </Text>
                  )}
                </HStack>
              </VStack>
            </Box>
          </View>
          <Text fontSize={25} bold color="black">
            Chuyến đi:
          </Text>
          <View style={styles.cardInsideDateTime} m={2}>
            <DetailCard
              title="Loại xe"
              info={vehicle?.name === null ? "" : vehicle?.name}
            />
            <DetailCard
              title="Loại chuyến"
              info={
                routeData === null
                  ? ""
                  : routeData?.tripType === "ONE_WAY"
                  ? "Một chiều"
                  : "Hai chiều"
              }
            />
            <DetailCard
              title="Ngày bắt đầu"
              info={
                data[0]?.routineDate === null
                  ? ""
                  : formatDateString(data[0]?.routineDate)
              }
            />
            {routeData?.tripType === "ONE_WAY" && (
              <DetailCard
                title="Giờ đón"
                info={data[0]?.pickupTime === null ? "" : data[0]?.pickupTime}
              />
            )}
            {routeData?.tripType === "ROUND_TRIP" && (
              <VStack>
                <DetailCard
                  title="Giờ đón chiều đi"
                  info={data[0]?.pickupTime === null ? "" : data[0]?.pickupTime}
                />
                <DetailCard
                  title="Giờ đón chiều về"
                  info={
                    routeData.roundTripBeginTime === null
                      ? ""
                      : routeData.roundTripBeginTime
                  }
                />
              </VStack>
            )}

            <DetailCard
              title="Ngày trong tuần"
              info={vnDays === null ? "" : vnDays}
            />
            <DetailCard
              title="Ngày đặt"
              info={currentDate === null ? "" : formatDateString(currentDate)}
            />
            <DetailCard
              title="Số ngày đi"
              info={data === null ? 0 : data.length}
            />
            <DetailCard
              title="Số chuyến đi"
              info={
                routeData === null
                  ? ""
                  : routeData.tripType != "ROUND_TRIP"
                  ? data.length
                  : data.length * 2
              }
            />
            <HStack justifyContent="flex-end" mb="3" mt="3">
              <TouchableOpacity
                style={vigoStyles.buttonWhite}
                onPress={() => {
                  setRoutinesModalVisible(true);
                }}
              >
                <Text style={vigoStyles.buttonWhiteText}>
                  Xem các chuyến đi
                </Text>
              </TouchableOpacity>
            </HStack>

            <ViewRoutinesModal
              modalVisible={routinesModalVisible}
              setModalVisible={setRoutinesModalVisible}
              routines={
                roundTrip
                  ? [...routines.routeRoutines, ...roundTrip.routeRoutines]
                  : routines.routeRoutines
              }
              tripType={routeData?.tripType}
            />
          </View>
          <Text fontSize={25} bold color="black">
            Thanh toán:
          </Text>
          {fareCalculation != null && (
            <View style={styles.cardInsideDateTime} m={2}>
              <DetailCard
                title="Giá gốc"
                info={vndFormat(
                  fareCalculation?.originalFare +
                    fareCalculation?.roundTripOriginalFare
                )}
              />
              <DetailCard
                title="Tổng khuyến mãi"
                info={vndFormat(
                  fareCalculation?.routineTypeDiscount +
                    fareCalculation?.roundTripRoutineTypeDiscount
                )}
              />
              <DetailCard
                title="Phụ phí"
                info={vndFormat(
                  fareCalculation?.additionalFare +
                    fareCalculation?.roundTripAdditionalFare
                )}
              />
              <DetailCard
                title="Tổng tiền"
                info={vndFormat(
                  fareCalculation?.finalFare +
                    fareCalculation?.roundTripFinalFare
                )}
              />
            </View>
          )}
        </View>
        <View style={styles.footer}>
          {fareCalculation != null ? (
            <TouchableOpacity style={styles.button} onPress={checkBalance}>
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Tiếp tục
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Quay lại
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
  payment: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "gray",
  },
  container: {
    flex: 1,
  },
  detail: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  row: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  body: {
    flex: 1,
    backgroundColor: "white",
  },
  calen: {
    padding: 20,
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  sdr: {
    padding: 10,
  },
  button: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: themeColors.primary,
    alignItems: "center",
  },
  footer: {
    padding: 10,
  },
});

export default BookingDetailScreen;

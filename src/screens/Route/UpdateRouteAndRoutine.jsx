import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { themeColors } from "../../assets/theme";
import {
  checkRoundTripRoutines,
  checkRoutine,
  createRoutine,
} from "../../service/routineService";
import { useNavigation } from "@react-navigation/native";
import SelectRouteHeader from "../../components/Header/SelectRouteHeader";
import { Picker } from "@react-native-picker/picker";
import {
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
} from "react-native-heroicons/solid";
import {
  Box,
  CheckIcon,
  HStack,
  ScrollView,
  Select,
  VStack,
  View,
  useToast,
} from "native-base";
import { createRoute } from "../../service/routeService";
import axios from "axios";
import InputCard from "../../components/Card/InputCard";
import {
  getBookingById,
  getBookingDetailByBookingId,
} from "../../service/bookingService";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import ViGoStationSelect from "../../components/Map/ViGoStationSelect";
import { handleError } from "../../utils/alertUtils";
import moment from "moment";
import { addDays } from "../../utils/datetimeUtils";

const UpdateRouteAndRoutineScreen = ({ route }) => {
  const navigation = useNavigation();
  const { bookingDetailId, position } = route.params;
  const [bookingDetail, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    console.log(bookingDetailId);
    try {
      getBookingById(bookingDetailId).then((response) => {
        const bookingDetail = response.data;
        console.log("bookingDetail", response.data);
        setBooking(response.data);
        setIsLoading(false);
        setFrequency(bookingDetail?.customerRoute.routineType);
        setStartDay(bookingDetail?.startDate);
        setRouteType(bookingDetail?.customerRoute.type);
        setRouteId(bookingDetail?.customerRoute.id);
        setNumberOfOccurrences(bookingDetail?.totalFrequencyCount);
        setRoundTripRouteId(bookingDetail?.customerRoute.roundTripRouteId);
        if (bookingDetail?.daysOfWeek != null) {
          convertToDayName(bookingDetail?.daysOfWeek);
        }

        getBookingDetailByBookingId(bookingDetailId, undefined, 2, 1).then(
          (response) => {
            console.log("response", response.data.data);
            setChosenTime(response.data.data[0].customerDesiredPickupTime);
            setChosenBackTime(response.data.data[1].customerDesiredPickupTime);
          }
        );
      });
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
      console.error(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [bookingDetailId]);
  console.log("Update", pickupPositionLocal, destinationPositionLocal);

  const pickupPositionLocal =
    position.customerRoute?.startStation?.latitude &&
    position.customerRoute?.startStation?.longitude
      ? {
          //   geometry: {
          //     location: {
          //       lat: position.customerRoute?.startStation.latitude,
          //       lng: position.customerRoute.startStation.longitude,
          //     },
          //   },
          //   address: position.customerRoute.startStation.address,
          //   name: position.customerRoute.startStation.name,
          //   formatted_address: position.customerRoute.startStation.address,
          address: position.customerRoute.startStation.address,
          name: position.customerRoute.startStation.name,
          latitude: position.customerRoute?.startStation.latitude,
          longitude: position.customerRoute.startStation.longitude,
          type: position.customerRoute.startStation.type,
          value:
            position.customerRoute.startStation.type == "OTHER"
              ? "other"
              : position.customerRoute.startStation.id,
        }
      : null;

  const destinationPositionLocal =
    position.customerRoute?.endStation?.latitude &&
    position.customerRoute?.endStation?.longitude
      ? {
          //   geometry: {
          //     location: {
          //       lat: position.customerRoute.endStation.latitude,
          //       lng: position?.customerRoute.endStation.longitude,
          //     },
          //   },
          //   address: position.customerRoute.endStation.address,
          //   name: position.customerRoute.endStation.name,
          //   formatted_address: position.customerRoute.endStation.address,
          address: position.customerRoute.endStation.address,
          name: position.customerRoute.endStation.name,
          latitude: position.customerRoute?.endStation.latitude,
          longitude: position.customerRoute.endStation.longitude,
          type: position.customerRoute.endStation.type,
          value:
            position.customerRoute.endStation.type == "OTHER"
              ? "other"
              : position.customerRoute.endStation.id,
        }
      : null;
  const [selectedDays, setSelectedDays] = useState([]);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [isBackTimePickerVisible, setBackTimePickerVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [chosenTime, setChosenTime] = useState("");
  const [chosenBackTime, setChosenBackTime] = useState("");
  const [numberOfOccurrences, setNumberOfOccurrences] = useState(0);
  const [numberOfWeeks, setNumberOfWeeks] = useState("");
  const [routeId, setRouteId] = useState("");
  const [roundTripRouteId, setRoundTripRouteId] = useState("");
  const [frequency, setFrequency] = useState(
    bookingDetail?.customerRoute.routineType
  );
  const [routeType, setRouteType] = useState(bookingDetail?.customerRoute.type);
  const [selectedDate, setSelectedDate] = useState("");
  const [startDay, setStartDay] = useState(bookingDetail?.startDate);
  const toast = useToast();

  const [pickupPosition, setPickupPosition] = useState(pickupPositionLocal);
  const [destinationPosition, setDestinationPosition] = useState(
    destinationPositionLocal
  );

  const [pickupStation, setPickupStation] = useState(pickupPositionLocal);
  const [dropoffStation, setDropoffStation] = useState(
    destinationPositionLocal
  );

  const handleDayToggle = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleChangeFrequency = (value) => {
    setFrequency(value);
  };
  const handleChangeRouteType = (value) => {
    setRouteType(value);
  };
  const formatDateString = (date) => {
    console.log("datedatedatedate", date);
    const dateObject = new Date(date);
    if (dateObject) {
      return dateObject.toLocaleDateString(); // Format the date as a string
    }
    return ""; // Return an empty string if the date is null
  };

  const handleDateConfirm = (date) => {
    setStartDay(date); // Extract the day of the week from the selected date
    setDatePickerVisible(false); // Hide the date picker after selection
  };
  const handleTimeConfirm = (time) => {
    const selectedHours = time.getHours();
    const selectedMinutes = time.getMinutes();

    // Combine them to format the time as "hh:mm:00"
    const formattedTime = `${selectedHours
      .toString()
      .padStart(2, "0")}:${selectedMinutes.toString().padStart(2, "0")}:00`;

    // Set the chosen time
    setChosenTime(formattedTime);

    setTimePickerVisible(false);
  };
  const handleBackTimeConfirm = (time) => {
    const selectedHours = time.getHours();
    const selectedMinutes = time.getMinutes();

    // Combine them to format the time as "hh:mm:00"
    const formattedTime = `${selectedHours
      .toString()
      .padStart(2, "0")}:${selectedMinutes.toString().padStart(2, "0")}:00`;

    // Set the chosen time
    setChosenBackTime(formattedTime);

    setBackTimePickerVisible(false);
  };
  const convertToDayName = (inputString) => {
    // Create a dictionary to map day abbreviations to day names
    const dayAbbreviations = {
      Sun: "Sunday",
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
    };

    // Split the input string into individual parts
    const parts = inputString.split(", ");

    // Initialize an array to store the day names
    const dayNames = [];

    // Loop through the parts and extract day names
    parts.forEach((part) => {
      // Extract the day abbreviation (e.g., "Thu")
      const dayAbbreviation = part.split(" ")[0];

      // Map the abbreviation to the corresponding day name
      const dayName = dayAbbreviations[dayAbbreviation];

      if (dayName) {
        dayNames.push(dayName);
      }
    });

    return dayNames;
  };
  const getDayOfWeek = (date) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek[date.getDay()];
  };
  const handleOccurrencesChange = (text) => {
    setNumberOfOccurrences(text);
  };
  const handleGenerateRoutineList = () => {
    if (startDay) {
      generateRoutines();
    } else {
      // Handle the case when no start date is selected
      console.log("Please select a start date.");
    }
  };
  const submitRoute = async () => {
    generateRoutines(routeId, roundTripRouteId);
  };
  const generateRoutines = (routeId, roundTripRouteId) => {
    const currentDate = new Date(startDay);
    const nextMonthsLater = new Date();
    const number = parseInt(numberOfOccurrences);
    const nextWeeks = new Date(
      currentDate.getTime() + number * 7 * 24 * 60 * 60 * 1000
    );
    console.log("currentDate", currentDate);

    nextThreeMonths = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + number,
      1
    );
    const weekdays = selectedDays.map((day) =>
      [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ].indexOf(day)
    );
    const routines = [];
    const roundRoutines = [];
    console.log("nextThreeMonths", nextThreeMonths);
    if (frequency === "WEEKLY") {
      while (currentDate < nextWeeks) {
        // Check if the current day is in the selected days and is greater than or equal to the start day
        if (
          weekdays.includes(currentDate.getDay()) &&
          startDay <= currentDate
        ) {
          const now = new Date();

          if (
            currentDate > now ||
            (currentDate.getDate() == now.getDate() &&
              chosenTime > moment().format("HH:mm:ss").toString())
          ) {
            const options = {
              day: "2-digit", // Two-digit day (e.g., "01", "02", ..., "31")
              month: "2-digit", // Two-digit month (e.g., "01", "02", ..., "12")
              year: "numeric", // Four-digit year (e.g., "2023")
            };
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            if (routeType === "ONE_WAY") {
              routines.push({
                routineDate: `${year}-${month.toString().padStart(2, "0")}-${day
                  .toString()
                  .padStart(2, "0")}`,
                pickupTime: chosenTime,
                status: "ACTIVE",
              });
            } else {
              routines.push({
                routineDate: `${year}-${month.toString().padStart(2, "0")}-${day
                  .toString()
                  .padStart(2, "0")}`,
                pickupTime: chosenTime,
                status: "ACTIVE",
              });
              roundRoutines.push({
                routineDate: `${year}-${month.toString().padStart(2, "0")}-${day
                  .toString()
                  .padStart(2, "0")}`,
                pickupTime: chosenBackTime,
                status: "ACTIVE",
              });
            }
          }

          //weekdaysList.push(new Date(currentDate)); // Store a new instance of the date to avoid modifying the original date
        }
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }
    } else {
      const validTargetDays = weekdays.map((day) => day % 7);
      while (currentDate < nextThreeMonths) {
        if (
          validTargetDays.includes(currentDate.getDay()) &&
          startDay <= currentDate
        ) {
          if (currentDate > new Date()) {
            const newDays = new Date(currentDate);
            const day = newDays.getDate();
            const month = newDays.getMonth() + 1;
            const year = newDays.getFullYear();
            if (routeType === "ONE_WAY") {
              routines.push({
                routineDate: `${year}-${month.toString().padStart(2, "0")}-${day
                  .toString()
                  .padStart(2, "0")}`,
                pickupTime: chosenTime,
                status: "ACTIVE",
              });
            } else {
              routines.push({
                routineDate: `${year}-${month.toString().padStart(2, "0")}-${day
                  .toString()
                  .padStart(2, "0")}`,
                pickupTime: chosenTime,
                status: "ACTIVE",
              });
              roundRoutines.push({
                routineDate: `${year}-${month.toString().padStart(2, "0")}-${day
                  .toString()
                  .padStart(2, "0")}`,
                pickupTime: chosenBackTime,
                status: "ACTIVE",
              });
            }
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    console.log(routines.length, selectedDays, frequency, chosenTime, routeId);
    handelCreateRoutine(routines, roundRoutines, routeId, roundTripRouteId);
  };

  const handelCreateRoutine = async (
    routines,
    roundRoutines,
    routeId,
    roundTripRouteId
  ) => {
    console.log(routines);
    try {
      let requestData = {};
      if (routeType === "ONE_WAY") {
        requestData = {
          routeId: routeId,
          routeRoutines: routines,
          startPoint: {
            latitude: pickupStation.latitude,
            longitude: pickupStation.longitude,
          },
          endPoint: {
            latitude: dropoffStation.latitude,
            longitude: dropoffStation.longitude,
          },
        };
        if (routines.length > 0) {
          console.log("Tao thanh coong");
          await checkRoutine(requestData).then((response) => {
            if (response != null) {
              console.log("Tao thanh coong");
              navigation.navigate("UpdateBooking", {
                routines: requestData,
                roundTrip: null,
                pickupPosition: {
                  geometry: {
                    location: {
                      lat: pickupStation.latitude,
                      lng: pickupStation.longitude,
                    },
                  },
                  name: pickupStation.name,
                  formatted_address: pickupStation.address,
                },
                destinationPosition: {
                  geometry: {
                    location: {
                      lat: dropoffStation.latitude,
                      lng: dropoffStation.longitude,
                    },
                  },
                  name: dropoffStation.name,
                  formatted_address: dropoffStation.address,
                },
                routineType: frequency,
                type: routeType,
                pickupTime: chosenTime,
                pickupBackTime: chosenBackTime,
                daysOfWeek: selectedDays,
                startDay: startDay,
                bookingId: bookingDetailId,
                numberOfOccurrences: numberOfOccurrences,
              });
            } /*else {
              // toast.show({
              //   title: "Bạn đã trùng thời gian với lịch trình khác",
              //   placement: "bottom",
              // });
              handleError("Có lỗi xảy ra", error);
            }*/
          });
        }
      } else {
        let requestData1 = {
          routeId: routeId,
          routeRoutines: routines,
          startPoint: {
            latitude: pickupStation.latitude,
            longitude: pickupStation.longitude,
          },
          endPoint: {
            latitude: dropoffStation.latitude,
            longitude: dropoffStation.longitude,
          },
        };
        let requestData2 = {
          routeId: roundTripRouteId,
          routeRoutines: roundRoutines,
          startPoint: {
            latitude: dropoffStation.latitude,
            longitude: dropoffStation.longitude,
          },
          endPoint: {
            latitude: pickupStation.latitude,
            longitude: pickupStation.longitude,
          },
        };

        let bothRequestData = {
          routeId: routeId,
          routeRoutines: routines,
          roundRouteRoutines: roundRoutines,
          startPoint: {
            latitude: pickupStation.latitude,
            longitude: pickupStation.longitude,
          },
          endPoint: {
            latitude: dropoffStation.latitude,
            longitude: dropoffStation.longitude,
          },
        };

        // console.log("length", roundRoutines.length, routines.length);

        console.log("Routines ", requestData1);
        console.log("Round ", requestData2);
        console.log("Both ", bothRequestData);

        if (routines.length > 0 && roundRoutines.length > 0) {
          const check1 = await checkRoutine(requestData1);
          let check2 = null;
          if (roundTripRouteId) {
            check2 = await checkRoutine(requestData2);
          }
          const bothCheck = await checkRoundTripRoutines(bothRequestData);

          if (
            check1 != null &&
            (roundTripRouteId == null || check2 != null) &&
            bothCheck != null
          ) {
            navigation.navigate("UpdateBooking", {
              routines: requestData1,
              roundTrip: requestData2,
              pickupPosition: {
                geometry: {
                  location: {
                    lat: pickupStation.latitude,
                    lng: pickupStation.longitude,
                  },
                },
                name: pickupStation.name,
                formatted_address: pickupStation.address,
              },
              destinationPosition: {
                geometry: {
                  location: {
                    lat: dropoffStation.latitude,
                    lng: dropoffStation.longitude,
                  },
                },
                name: dropoffStation.name,
                formatted_address: dropoffStation.address,
              },
              routineType: frequency,
              type: routeType,
              pickupTime: chosenTime,
              pickupBackTime: chosenBackTime,
              daysOfWeek: selectedDays,
              startDay: startDay,
              bookingId: bookingDetailId,
              numberOfOccurrences: numberOfOccurrences,
            });
          } else {
            // toast.show({
            //   title: "Lỗi tạo lịch trình",
            //   placement: "bottom",
            // });
            // handleError(
            //   "Có lỗi xảy ra",
            //   "Lỗi tạo lịch trình, vui lòng kiểm tra lại các thông tin!"
            // );
          }
        }
      }
    } catch (error) {
      console.log(error);
      // toast.show({
      //   title: "Lỗi tạo lịch trình",
      //   placement: "bottom",
      // });
      handleError("Có lỗi xảy ra", error);
    }
  };
  const handlePickupPlaceSelection = (details) => {
    setPickupPosition(details);
  };
  const handleDestinationPlaceSelection = (details) => {
    setDestinationPosition(details);
  };
  return (
    <View style={styles.container}>
      <SelectRouteHeader
        title="Cập nhật chuyến đi"
        subtitle="Bạn có thể cập nhật lại chuyến đi theo lịch trình mới."
        onBack={() => navigation.goBack()}
      />
      {bookingDetail === null ? (
        <ViGoSpinner isLoading={isLoading} />
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputDayContainer}>
            <Box alignSelf="center" w="100%">
              {pickupPosition != null && destinationPosition != null && (
                <VStack w="100%">
                  <View style={styles.stationCard}>
                    <VStack my="3" justifyContent="center">
                      <Box mb="2">
                        <ViGoStationSelect
                          displayName="Điểm đón"
                          placeholder="Chọn điểm đón..."
                          setSelectedStation={setPickupStation}
                          selectedStation={pickupStation}
                        />
                      </Box>
                      <Box mt="2">
                        <ViGoStationSelect
                          displayName="Điểm đến"
                          placeholder="Chọn điểm đến..."
                          setSelectedStation={setDropoffStation}
                          selectedStation={dropoffStation}
                        />
                      </Box>
                    </VStack>
                  </View>
                </VStack>
              )}
            </Box>
            <HStack justifyContent="space-between">
              <Box
                w="49%"
                style={[styles.horizontalContainer, styles.shadowProp]}
              >
                <Text style={styles.inputTitle}>Lịch trình đi: </Text>
                <Select
                  selectedValue={frequency}
                  //   minWidth={170}
                  accessibilityLabel="Choose option"
                  onValueChange={handleChangeFrequency}
                  flex={1}
                  //   _selectedItem={{
                  //     bg: themeColors.linear,
                  //     endIcon: <CheckIcon size={2} />,
                  //   }}
                  borderWidth={0}
                >
                  <Select.Item label="Mỗi tuần" value="WEEKLY" />
                  <Select.Item label="Mỗi tháng" value="MONTHLY" />
                </Select>
              </Box>
              <Box
                w="49%"
                style={[styles.horizontalContainer, styles.shadowProp]}
              >
                <Text style={styles.inputTitle}>Loại chuyến: </Text>
                <Select
                  selectedValue={routeType}
                  //   minWidth={170}
                  flex={1}
                  accessibilityLabel="Choose option"
                  onValueChange={handleChangeRouteType}
                  //   _selectedItem={{
                  //     bg: themeColors.linear,
                  //     endIcon: <CheckIcon size={2} />,
                  //   }}
                  borderWidth={0}
                >
                  <Select.Item label="Chuyến một chiều" value="ONE_WAY" />
                  <Select.Item label="Chuyến hai chiều" value="ROUND_TRIP" />
                </Select>
              </Box>
            </HStack>

            <View style={styles.horizontalContainer}>
              <Text style={styles.inputTitle}>Mỗi T2,T4,T6,...</Text>
              <View style={styles.inputBorder}>
                <TouchableOpacity
                  onPress={() => handleDayToggle("Sunday")}
                  style={[
                    styles.circleButton,
                    {
                      backgroundColor: selectedDays.includes("Sunday")
                        ? themeColors.primary
                        : "white",
                    },
                  ]}
                >
                  <Text style={styles.circleButtonText}>CN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDayToggle("Monday")}
                  style={[
                    styles.circleButton,
                    {
                      backgroundColor: selectedDays.includes("Monday")
                        ? themeColors.primary
                        : "white",
                    },
                  ]}
                >
                  <Text style={styles.circleButtonText}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDayToggle("Tuesday")}
                  style={[
                    styles.circleButton,
                    {
                      backgroundColor: selectedDays.includes("Tuesday")
                        ? themeColors.primary
                        : "white",
                    },
                  ]}
                >
                  <Text style={styles.circleButtonText}>3</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDayToggle("Wednesday")}
                  style={[
                    styles.circleButton,
                    {
                      backgroundColor: selectedDays.includes("Wednesday")
                        ? themeColors.primary
                        : "white",
                    },
                  ]}
                >
                  <Text style={styles.circleButtonText}>4</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDayToggle("Thursday")}
                  style={[
                    styles.circleButton,
                    {
                      backgroundColor: selectedDays.includes("Thursday")
                        ? themeColors.primary
                        : "white",
                    },
                  ]}
                >
                  <Text style={styles.circleButtonText}>5</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDayToggle("Friday")}
                  style={[
                    styles.circleButton,
                    {
                      backgroundColor: selectedDays.includes("Friday")
                        ? themeColors.primary
                        : "white",
                    },
                  ]}
                >
                  <Text style={styles.circleButtonText}>6</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDayToggle("Saturday")}
                  style={[
                    styles.circleButton,
                    {
                      backgroundColor: selectedDays.includes("Saturday")
                        ? themeColors.primary
                        : "white",
                    },
                  ]}
                >
                  <Text style={styles.circleButtonText}>7</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View w="full">
              <VStack>
                <View style={styles.horizontalContainer}>
                  {frequency === "MONTHLY" ? (
                    <Text style={styles.inputTitle}>Số tháng bạn muốn đi:</Text>
                  ) : (
                    <Text style={styles.inputTitle}>Số tuần bạn muốn đi:</Text>
                  )}
                  <View>
                    <TextInput
                      value={`${numberOfOccurrences ?? 0}`}
                      onChangeText={handleOccurrencesChange}
                      keyboardType="numeric"
                      style={{ height: 50 }}
                      // style={{ borderWidth: 2, borderColor: "gray", padding: 5 }}
                    />
                  </View>
                </View>
              </VStack>
            </View>
            {routeType !== "ONE_WAY" ? (
              <Box>
                <View style={[styles.cardInsideDateTime, styles.shadowProp]}>
                  <TouchableOpacity
                    style={{ flexDirection: "row", justifyContent: "center" }}
                    onPress={() => setDatePickerVisible(true)}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        flexGrow: 1,
                        justifyContent: "center",
                      }}
                    >
                      <CalendarDaysIcon size={25} color="#00A1A1" />
                    </View>

                    <View
                      style={{
                        flexDirection: "column",
                        flexGrow: 1,
                        justifyContent: "start",
                      }}
                    >
                      <Text style={styles.title}>Ngày bắt đầu</Text>

                      <Text
                        style={{
                          paddingLeft: 10,
                          paddingBottom: 5,
                          fontSize: 15,
                          fontWeight: "bold",
                        }}
                      >
                        {formatDateString(startDay)}
                      </Text>
                    </View>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      minimumDate={addDays(new Date(), 1)}
                      onConfirm={handleDateConfirm}
                      onCancel={() => setDatePickerVisible(false)}
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  <HStack justifyContent="space-between">
                    <Box
                      w="49%"
                      style={[styles.cardInsideDateTime, styles.shadowProp]}
                    >
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          flexGrow: 1,
                          justifyContent: "center",
                        }}
                        onPress={() => setTimePickerVisible(true)}
                      >
                        <View
                          style={{
                            flexDirection: "column",
                            flexGrow: 1,
                            justifyContent: "center",
                          }}
                        >
                          <ClockIcon
                            name="time-outline"
                            size={25}
                            color="#00A1A1"
                          />
                        </View>

                        <View
                          style={{
                            flexDirection: "column",
                            flexGrow: 1,
                            justifyContent: "center",
                          }}
                        >
                          <Text style={styles.title}>
                            Thời gian đón (Chiều đi)
                          </Text>

                          <Text
                            style={{
                              paddingLeft: 10,
                              paddingBottom: 5,
                              fontSize: 15,
                              fontWeight: "bold",
                            }}
                          >
                            {chosenTime}
                          </Text>
                        </View>
                        <DateTimePickerModal
                          isVisible={isTimePickerVisible}
                          mode="time"
                          onConfirm={handleTimeConfirm}
                          onCancel={() => setTimePickerVisible(false)}
                        />
                      </TouchableOpacity>
                    </Box>
                    <Box
                      w="49%"
                      style={[styles.cardInsideDateTime, styles.shadowProp]}
                    >
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          flexGrow: 1,
                          justifyContent: "center",
                        }}
                        onPress={() => setBackTimePickerVisible(true)}
                      >
                        <View
                          style={{
                            flexDirection: "column",
                            flexGrow: 1,
                            justifyContent: "center",
                          }}
                        >
                          <ClockIcon
                            name="time-outline"
                            size={25}
                            color="#00A1A1"
                          />
                        </View>

                        <View
                          style={{
                            flexDirection: "column",
                            flexGrow: 1,
                            justifyContent: "center",
                          }}
                        >
                          <Text style={styles.title}>
                            Thời gian đón (Chiều về)
                          </Text>

                          <Text
                            style={{
                              paddingLeft: 10,
                              paddingBottom: 5,
                              fontSize: 15,
                              fontWeight: "bold",
                            }}
                          >
                            {chosenBackTime}
                          </Text>
                        </View>
                        <DateTimePickerModal
                          isVisible={isBackTimePickerVisible}
                          mode="time"
                          onConfirm={handleBackTimeConfirm}
                          onCancel={() => setBackTimePickerVisible(false)}
                        />
                      </TouchableOpacity>
                    </Box>
                  </HStack>
                </View>
              </Box>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  w="49%"
                  style={[styles.cardInsideDateTime, styles.shadowProp]}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      flexGrow: 1,
                      justifyContent: "center",
                    }}
                    onPress={() => setTimePickerVisible(true)}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        flexGrow: 1,
                        justifyContent: "center",
                      }}
                    >
                      <ClockIcon
                        name="time-outline"
                        size={25}
                        color="#00A1A1"
                      />
                    </View>

                    <View
                      style={{
                        flexDirection: "column",
                        flexGrow: 1,
                        justifyContent: "center",
                      }}
                    >
                      <Text style={styles.title}>Thời gian đón</Text>

                      <Text
                        style={{
                          paddingLeft: 10,
                          paddingBottom: 5,
                          fontSize: 15,
                          fontWeight: "bold",
                        }}
                      >
                        {chosenTime}
                      </Text>
                    </View>
                    <DateTimePickerModal
                      isVisible={isTimePickerVisible}
                      mode="time"
                      onConfirm={handleTimeConfirm}
                      onCancel={() => setTimePickerVisible(false)}
                    />
                  </TouchableOpacity>
                </Box>
                <View
                  w="49%"
                  style={[styles.cardInsideDateTime, styles.shadowProp]}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      flexGrow: 1,
                      justifyContent: "center",
                    }}
                    onPress={() => setDatePickerVisible(true)}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        flexGrow: 1,
                        justifyContent: "center",
                      }}
                    >
                      <CalendarDaysIcon size={24} color="#00A1A1" />
                    </View>

                    <View
                      style={{
                        flexDirection: "column",
                        flexGrow: 1,
                        justifyContent: "center",
                      }}
                    >
                      <Text style={styles.title}>Ngày bắt đầu</Text>

                      <Text
                        style={{
                          paddingLeft: 10,
                          paddingBottom: 5,
                          fontSize: 15,
                          fontWeight: "bold",
                        }}
                      >
                        {formatDateString(startDay)}
                      </Text>
                    </View>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      minimumDate={addDays(new Date(), 1)}
                      mode="date"
                      onConfirm={handleDateConfirm}
                      onCancel={() => setDatePickerVisible(false)}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={submitRoute}
            >
              <Text style={styles.continueButtonText}>Cập nhật lịch đi </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    width: "100%",
  },
  cardInsideDateTime: {
    backgroundColor: "white",
    borderRadius: 10,

    paddingHorizontal: 15,
    marginVertical: 10,
    // marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  inputDayContainer: {
    padding: 10,
    width: "100%",
    marginBottom: 10,

    borderRadius: 10,
  },
  container: {
    // alignItems: "center",
    // flex: 1,
    backgroundColor: "#feffff",
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 5,
    borderColor: themeColors.primary,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  inputContainerDays: {
    marginBottom: 10,
    backgroundColor: themeColors.linear,
  },
  inputContainer: {
    width: "95%",
    marginBottom: 10,
    backgroundColor: themeColors.linear,
  },
  inputTitle: {
    borderRadius: 10,
    color: themeColors.linear,
    position: "absolute",
    top: -8,
    left: 10,
    backgroundColor: themeColors.primary,
    paddingHorizontal: 5,
    zIndex: 1,
  },
  inputBorderDays: {
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  inputBorder: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    alignItems: "center",
  },
  horizontalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,

    paddingHorizontal: 15,
    marginVertical: 10,
    // marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  input: {
    height: 40,
    padding: 10,
  },
  circleButton: {
    borderWidth: 1.5,
    borderColor: themeColors.primary,
    padding: 5,
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  circleButtonText: {
    fontSize: 15,
  },
  continueButton: {
    alignItems: "center",
    justifyItems: "flex-end",
    backgroundColor: themeColors.primary,
    borderRadius: 10,
    justifyContent: "center",
    height: 50,
  },
  continueButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  stationCard: {
    backgroundColor: "white",
    borderRadius: 10,

    paddingHorizontal: 15,
    // width: "100%",
    marginVertical: 10,
    // marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
});

export default UpdateRouteAndRoutineScreen;

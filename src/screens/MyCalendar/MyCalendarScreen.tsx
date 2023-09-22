import { memo, useContext, useEffect, useState } from "react";
import { Agenda, AgendaSchedule, LocaleConfig } from "react-native-calendars";
import { UserContext } from "../../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import moment from "moment";
import { getCustomerBookingDetails } from "../../service/bookingDetailService";
import { toVnDateString, toVnTimeString } from "../../utils/datetimeUtils";
import { getErrorMessage } from "../../utils/alertUtils";
import { BackHandler, StyleSheet, TouchableOpacity } from "react-native";
import { Badge, Box, Fab, HStack, ScrollView, Text, View } from "native-base";
import { RefreshControl } from "react-native";
import InfoAlert from "../../components/Alert/InfoAlert";
import { themeColors } from "../../assets/theme";
import { SafeAreaView } from "react-native";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import { MapIcon } from "react-native-heroicons/solid";

LocaleConfig.locales["vn"] = {
  monthNames: [
    "Tháng một",
    "Tháng hai",
    "Tháng ba",
    "Tháng tư",
    "Tháng năm",
    "Tháng sáu",
    "Tháng bảy",
    "Tháng tám",
    "Tháng chín",
    "Tháng mười",
    "Tháng mười một",
    "Tháng mười hai",
  ],
  monthNamesShort: [
    "Tháng một",
    "Tháng hai",
    "Tháng ba",
    "Tháng tư",
    "Tháng năm",
    "Tháng sáu",
    "Tháng bảy",
    "Tháng tám",
    "Tháng chín",
    "Tháng mười",
    "Tháng mười một",
    "Tháng mười hai",
  ],
  dayNames: [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ],
  dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  today: "Hôm nay",
};

LocaleConfig.defaultLocale = "vn";

const MyCalendarScreen = () => {
  const { user } = useContext(UserContext);

  const [items, setItems] = useState({} as AgendaSchedule);

  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const { isError, setErrorMessage, setIsError, errorMessage } =
    useErrorHandlingHook();

  const formattedCurrentDate = moment().format("YYYY-MM-DD").toString();
  const maximumViewDate = moment()
    .add(6, "months")
    .format("YYYY-MM-DD")
    .toString();

  const [displayFab, setDisplayFab] = useState(true);
  const [selectedDate, setSelectedDate] = useState(formattedCurrentDate);

  const fetchData = async () => {
    setIsError(false);
    setIsLoading(true);
    // console.log(user.id);
    try {
      const tripsResponse = await getCustomerBookingDetails(
        user.id,
        formattedCurrentDate,
        maximumViewDate,
        "PENDING_ASSIGN,ASSIGNED",
        -1,
        1 /*, formattedPreviousDate*/
      );

      const responseItems = tripsResponse.data;
      // console.log(responseItems);
      const agendaItems = {} as any;

      // const itemMarkedDates = {};

      responseItems.forEach((item: any) => {
        const { startStation, endStation, customerRouteRoutine } = item;
        const dateString = moment(item.date).format("YYYY-MM-DD");

        if (dateString === formattedCurrentDate) {
          if (
            moment(item.customerDesiredPickupTime, "HH:mm:ss").isBefore(
              moment()
            )
          ) {
            return;
          }
        }
        if (!agendaItems[dateString]) {
          agendaItems[dateString] = [];
        }

        const itemData = {
          title: `${startStation.name} - ${endStation.name}`,
          time: `${toVnTimeString(
            item.customerDesiredPickupTime
          )} - ${toVnDateString(item.date)}`,
          id: item.id,
          driverId: item.driverId,
          status: item.status,
        };
        agendaItems[dateString].push(itemData);
      });

      setItems(agendaItems);
      if (
        !agendaItems[formattedCurrentDate] ||
        agendaItems[formattedCurrentDate].length == 0
      ) {
        setDisplayFab(false);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // const unsubscribe = navigation.addListener("focus", () => {
    fetchData();
    // });

    // return unsubscribe;
    const hardwareBackPress = BackHandler.addEventListener(
      "hardwareBackPress",
      () => navigation.navigate("Home")
    );

    return () => hardwareBackPress.remove();
  }, []);

  const handleClickOnTrip = (itemId: string) => {
    // navigation.navigate("StartRoute", { item });
    // navigation.navigate("CurrentStartingTrip", { bookingDetailId: item.id });
  };

  const renderItem = (item: any) => {
    // console.log(item.status);
    return (
      <TouchableOpacity onPress={() => handleClickOnTrip(item.id)}>
        <View style={styles.itemContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.time}</Text>
          <HStack justifyContent={"flex-end"}>
            {item.status == "PENDING_ASSIGN" && (
              <Badge colorScheme={"warning"}>Đang chờ tài xế</Badge>
            )}
            {item.status == "ASSIGNED" && (
              <Badge colorScheme={"info"}>Đã có tài xế</Badge>
            )}
          </HStack>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = () => {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => fetchData()}
          />
        }
      >
        <Box marginTop="2">
          <InfoAlert message="Bạn không có chuyến xe nào vào hôm nay" />
        </Box>
      </ScrollView>
    );
  };

  const theme = {
    // Customize the agenda styles
    agendaKnobColor: themeColors.primary,
    selectedDayBackgroundColor: themeColors.primary,
    dotColor: "red",
    todayTextColor: "green",
    agendaTodayColor: themeColors.primary,
    // Add more style customizations as needed
  };

  const onDatePress = (day: any) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);

    const schedules = items[dateString];
    if (!schedules || schedules.length == 0) {
      setDisplayFab(false);
    } else {
      setDisplayFab(true);
    }
    // console.log(date);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <View>
    <Header
      title="Lịch trình của tôi"
      onBackButtonPress={() => navigation.navigate("Home")}
    />
  </View> */}

      <ErrorAlert isError={isError} errorMessage={errorMessage}>
        <Agenda
          items={items}
          // selected={date ? moment(date).format("YYYY-MM-DD") : undefined}
          renderItem={(item) => renderItem(item)}
          // renderEmptyDate={() => renderEmptyDate()}
          renderEmptyData={() => renderEmptyDate()}
          theme={theme} // Apply the custom theme
          showOnlySelectedDayItems
          onRefresh={() => {
            // console.log("Reloading Agenda...");
            fetchData();
          }}
          minDate={formattedCurrentDate}
          refreshing={isLoading}
          onDayPress={onDatePress}
          maxDate={maximumViewDate}
          futureScrollRange={6}
          pastScrollRange={1}
        />
        {displayFab && (
          <Fab
            renderInPortal={false}
            shadow={2}
            size="sm"
            backgroundColor={themeColors.primary}
            icon={<MapIcon color="white" size={24} />}
            onPress={() => {
              navigation.navigate("ScheduleInDate", {
                date: selectedDate,
              });
            }}
          />
        )}
      </ErrorAlert>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 25,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemTime: {
    fontSize: 14,
    color: "gray",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default memo(MyCalendarScreen);

import React, { memo, useState } from "react";
import { StyleSheet } from "react-native";
import { themeColors } from "../../assets/theme";
import {
  Box,
  Center,
  HStack,
  IconButton,
  Image,
  Pressable,
  Stagger,
  Text,
  VStack,
  MaterialIcons,
  useDisclose,
  Icon,
  Divider,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowRightIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
} from "react-native-heroicons/solid";
import { toVnDateTimeString } from "../../utils/datetimeUtils";
import { TouchableOpacity } from "react-native";
const CardHistoryBooking = ({ item }) => {
  const img = require("../../assets/icons/BikeIcon.png");
  const navigation = useNavigation();
  console.log("History", item);
  const [status, setStatus] = useState("");
  const formatMoney = (money) => {
    console.log(money);
    const formattedCurrency = money.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    console.log(formattedCurrency);
    return formattedCurrency;
  };
  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const formattedDate = `${day} Th${month} ${year}`;
    return formattedDate;
  }
  function checkStatus(inputStatus) {
    if (inputStatus === "PENDING_ASSIGN") {
      return "Tài xế chưa nhận";
    } else if (inputStatus === "ASSIGNED") {
      return "Đang đi";
    } else if (inputStatus === "GOING_TO_PICKUP") {
      return "Đang rước";
    } else if (inputStatus === "ARRIVE_AT_PICKUP") {
      return "Đã đến điểm rước";
    } else if (inputStatus === "GOING_TO_DROPOFF") {
      return "Đang di chuyển";
    } else if (inputStatus === "ARRIVE_AT_DROPOFF") {
      return "Đã trả khách";
    } else if (inputStatus === "CANCELLED") {
      return "Đã hủy";
    } else if (inputStatus === "COMPLETED") {
      return "Đã hoàn thành";
    } else {
      return "";
    }
  }
  function getStatusColor(inputStatus) {
    switch (inputStatus) {
      case "PENDING_ASSIGN":
        return styles.pendingColor;
      case "ASSIGNED":
        return styles.assignedColor;
      case "GOING_TO_PICKUP":
        return styles.goingToPickupColor;
      case "ARRIVE_AT_PICKUP":
        return styles.arriveAtPickupColor;
      case "GOING_TO_DROPOFF":
        return styles.goingToDropoffColor;
      case "ARRIVE_AT_DROPOFF":
        return styles.arriveAtDropoffColor;
      case "CANCELLED":
        return styles.cancelledColor;
      case "COMPLETED":
        return styles.completedColor;
      default:
        return {}; // Default to an empty object if the status doesn't match any case
    }
  }

  function handleDetailBooking(bookingDetail) {
    navigation.navigate("DetailBooking", { bookingDetail: bookingDetail });
  }
  function handleUpdateBooking(bookingDetail) {
    navigation.navigate("UpdateRouteAndRoutine", {
      bookingDetailId: bookingDetail.id,
      position: bookingDetail,
    });
  }
  function handleTrackingDriverLocation(bookingDetail) {
    navigation.navigate("TrackingLocation", {
      bookingDetailId: bookingDetail.id,
    });
  }
  const { isOpen, onToggle } = useDisclose();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("MyRoute", { bookingDetailId: item.id });
      }}
    >
      <Box
        w="full"
        alignItems="center"
        p="2"
        _web={{
          shadow: 10,
          borderWidth: 0,
        }}
      >
        <Box
          w="100%"
          maxW="sm"
          rounded="xl"
          p="2"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          shadow={4}
          _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "white",
          }}
          _web={{
            shadow: 6,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: "white",
          }}
        >
          <VStack>
            <VStack
              alignItems="flex-start"
              space={4}
              justifyContent="flex-start"
            >
              <HStack alignItems="flex-start">
                <Box backgroundColor={themeColors.linear} p="2" rounded="xl">
                  <Image
                    p="1"
                    size={"xs"}
                    resizeMode="cover"
                    source={require("../../assets/icons/vigobike.png")}
                    alt="Alternate Text"
                  />
                </Box>
                <VStack ml="2">
                  <Text color="black" bold fontSize={15}>
                    {item.dropoffTime
                      ? toVnDateTimeString(item.dropoffTime)
                      : "Không có dữ liệu"}
                  </Text>
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    vigoBike
                  </Text>
                </VStack>
              </HStack>
              <Divider
                _light={{
                  bg: "muted.800",
                }}
                _dark={{
                  bg: "muted.50",
                }}
              />
              <HStack alignItems="center" justifyContent="flex-start">
                <Box pr={2}>
                  <MapPinIcon size={30} color={themeColors.primary} />
                </Box>

                <VStack w="90%">
                  <Text fontSize={15} color="black" bold>
                    Điểm đi:{" "}
                  </Text>
                  <Text numberOfLines={1} fontSize={15} color="black">
                    {item.startStation.address}
                  </Text>
                </VStack>
              </HStack>
              <HStack alignItems="center" justifyContent="flex-start">
                <Box pr={2}>
                  <MapPinIcon size={30} color={themeColors.primary} />
                </Box>

                <VStack w="90%">
                  <Text fontSize={15} color="black" bold>
                    Điểm đến:{" "}
                  </Text>
                  <Text numberOfLines={1} fontSize={15}>
                    {item.endStation.address}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </VStack>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: "100%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    padding: 15,
    backgroundColor: "#fff",
  },
  row: {
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  rowPick: {
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingEnd: 5,
  },
  column: {
    marginHorizontal: 5,
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  titlePrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: themeColors.primary,
    textAlign: "right",
  },
  titleButton: {
    fontSize: 10,
    color: themeColors.primary,
  },
  info: {
    textAlign: "right",
  },
  infoDate: {
    padding: 10,
    textAlign: "left",
  },
  infoStation: {
    width: 100,
  },

  pendingColor: {
    color: "orange", // Change to the desired color for PENDING_ASSIGN
  },
  assignedColor: {
    color: "blue", // Change to the desired color for ASSIGNED
  },
  goingToPickupColor: {
    color: "blue", // Change to the desired color for GOING_TO_PICKUP
  },
  arriveAtPickupColor: {
    color: "blue", // Change to the desired color for ARRIVE_AT_PICKUP
  },
  goingToDropoffColor: {
    color: "blue", // Change to the desired color for GOING_TO_DROPOFF
  },
  arriveAtDropoffColor: {
    color: "blue", // Change to the desired color for ARRIVE_AT_DROPOFF
  },
  cancelledColor: {
    color: "red", // Change to the desired color for CANCELLED
  },
  completedColor: {
    color: "green", // Change to the desired color for COMPLETED
  },
});

export default memo(CardHistoryBooking);

import { Badge, Box, HStack, Text, VStack } from "native-base";
import { toVnDateString, toVnTimeString } from "../../utils/datetimeUtils";
import { ForwardIcon } from "react-native-heroicons/outline";
import { TouchableOpacity } from "react-native";
import {
  getBookingDetailStatusColor,
  getBookingDetailStatusString,
} from "../../utils/enumUtils/bookingEnumUtils";
import { NavigationProp } from "@react-navigation/native";
import { memo } from "react";

interface HomeTripInformationCardInterface {
  currentTrip: any;
  upcomingTrip: any;
  navigation: any;
}
const HomeTripInformationCard = ({
  currentTrip,
  upcomingTrip,
  navigation,
}: HomeTripInformationCardInterface) => {
  const getCurrentTripStatusSubtitle = (status: string, bookingDetail: any) => {
    switch (status) {
      case "GOING_TO_PICKUP":
        return `Giờ đón khách: ${toVnTimeString(
          bookingDetail.customerDesiredPickupTime
        )}`;
      // break;
      case "ARRIVE_AT_PICKUP":
        return ``;
      // break;
      case "GOING_TO_DROPOFF":
        return ``;
      // break;
      case "ARRIVE_AT_DROPOFF":
        return ``;
      // break;
    }
  };
  // console.log(currentTrip);
  // console.log(upcomingTrip);
  return (
    // <Box justifyContent="flex-end">
    <Box
      backgroundColor="white"
      m="2"
      rounded={"sm"}
      px="2"
      shadow="5"
      // width="full"
      width="90%"
      alignSelf="center"
    >
      {currentTrip && (
        <TouchableOpacity
          onPress={() => {
            if (currentTrip.status == "GOING_TO_PICKUP") {
              navigation.navigate("TrackingOnGoingLocation", {
                bookingDetailId: currentTrip.id,
              })
            } else if (currentTrip.status == "GOING_TO_DROPOFF") {
              navigation.navigate("TrackingLocation", {
                bookingDetailId: currentTrip.id,
              })
            }
          }}
        >
          <VStack>
            <HStack mt="2">
              <Badge colorScheme={"info"}>
                {getBookingDetailStatusString(currentTrip.status)}
              </Badge>
            </HStack>
            {/* <Text
              opacity={0.5}
              color={getBookingDetailStatusColor(currentTrip.status)}
            >
              {getBookingDetailStatusString(currentTrip.status)}
            </Text> */}
            <Text fontSize={18} bold isTruncated>
              {currentTrip.startStation.name} - {currentTrip.endStation.name}
            </Text>
            <Text>
              {getCurrentTripStatusSubtitle(currentTrip.status, currentTrip)}
            </Text>
          </VStack>
        </TouchableOpacity>
      )}
      {upcomingTrip && !currentTrip && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MyRoute", { bookingDetailId: upcomingTrip.id, })
          }
        >
          <VStack>
            <HStack mt="2">
              <Badge colorScheme={"info"}>Sắp tới</Badge>
            </HStack>
            <Text fontSize={18} bold isTruncated width="95%">
              {upcomingTrip?.startStation.name} - {upcomingTrip.endStation.name}
            </Text>
            <HStack justifyContent="space-between" width="95%">
              <Text>
                Giờ đón khách:{" "}
                {/* {toVnTimeString(upcomingTrip?.customerDesiredPickupTime)} */}
              </Text>
              <Text>{toVnDateString(upcomingTrip.date)}</Text>
            </HStack>
          </VStack>
        </TouchableOpacity>
      )}
    </Box>
    // </Box>
  );
};

export default memo(HomeTripInformationCard);

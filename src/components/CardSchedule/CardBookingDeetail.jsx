import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
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
} from "native-base";

import { useNavigation } from "@react-navigation/native";
import {
  ArrowRightIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
} from "react-native-heroicons/solid";
import { toVnDateString, toVnTimeString } from "../../utils/datetimeUtils";
import { vndFormat } from "../../utils/numberUtils";
import { ChatBubbleLeftRightIcon } from "react-native-heroicons/outline";
const CardBookingDetail = ({ item }) => {
  const navigation = useNavigation();
  return (
    <HStack alignItems="center" alignSelf="center">
      <Box style={[styles.cardInsideDateTime]} alignSelf="stretch">
        <TouchableOpacity
          onPress={() => navigation.navigate("Feedback", { item: item })}
        >
          <HStack justifyContent="space-around" py={2} alignItems="flex-start">
            <HStack>
              <VStack>
                <HStack alignItems="center">
                  <ClockIcon size={20} color="#00A1A1" />
                  <Text w={100} marginLeft={2} bold color="gray.500">
                    Giờ đón
                  </Text>
                  <Text marginLeft={2} bold color="black">
                    {item.customerRouteRoutine.pickupTime}
                  </Text>
                </HStack>
                <HStack alignItems="center">
                  <CalendarIcon size={20} color="#00A1A1" />
                  <Text w={100} marginLeft={2} bold color="gray.500">
                    Ngày đón
                  </Text>
                  <Text marginLeft={2} bold color="black">
                    {item.customerRouteRoutine.routineDate}
                  </Text>
                </HStack>
                {item.driver !== null && (
                  <Box>
                    <HStack alignItems="center">
                      <UserIcon size={20} color="#00A1A1" />
                      <Text w={100} marginLeft={2} bold color="gray.500">
                        Tài xế
                      </Text>
                      <Text marginLeft={2} bold color="black">
                        {item.driver.name}
                      </Text>
                    </HStack>
                    <HStack alignItems="center">
                      <PhoneIcon size={20} color="#00A1A1" />
                      <Text w={100} marginLeft={2} bold color="gray.500">
                        Số điện thoại
                      </Text>
                      <Text marginLeft={2} bold color="black">
                        {item.driver.phone}
                      </Text>
                    </HStack>
                  </Box>
                )}
              </VStack>
              <VStack marginRight={2} marginLeft={2}>
                {/* <Text bold color="black">
                                    {toVnTimeString(item.customerDesiredPickupTime)}
                                </Text>

                                <Text bold color="black">
                                    {`${item.dayOfWeek}, ${toVnDateString(item.date)}`}
                                </Text> */}
              </VStack>
            </HStack>
          </HStack>
        </TouchableOpacity>

        {item.driver && (
          <HStack justifyContent="flex-end" mb="2">
            <Box
              borderWidth={1}
              rounded="md"
              p="1"
              borderColor={themeColors.primary}
              ml={"5"}
            >
              <Pressable
                onPress={() =>
                  navigation.navigate("Message", {
                    bookingDetailId: item.id,
                    driver: item.driver,
                  })
                }
              >
                <ChatBubbleLeftRightIcon
                  size={25}
                  color={themeColors.primary}
                />
              </Pressable>
            </Box>
          </HStack>
        )}
      </Box>
    </HStack>
  );
};

const styles = StyleSheet.create({
  cardInsideDateTime: {
    // flexGrow: 1,
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
    // flexDirection: "row",
    // margin: 5,
  },
});
export default CardBookingDetail;

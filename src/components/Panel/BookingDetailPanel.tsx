import { ReactNode, memo, useContext, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Center,
  HStack,
  Image,
  ScrollView,
  Text,
  VStack,
  View,
} from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  ListBulletIcon,
  MapIcon,
  MapPinIcon,
  MinusIcon,
  PaperAirplaneIcon,
} from "react-native-heroicons/solid";
import {
  ClockIcon as ClockOutlineIcon,
  XCircleIcon,
} from "react-native-heroicons/outline";
import { themeColors, vigoStyles } from "../../assets/theme";
import {
  TripBasicInformation,
  TripFullInformation,
} from "../TripInformation/TripInformation";

interface BookingDetailPanelProps {
  item: any;
  actionButton?: ReactNode;
  driver?: any;
  navigation: any;
  duration: number;
  distance: number;
  displayButtons?: boolean;
  onCancelClick?: () => void;
}
const BookingDetailPanel = memo(
  ({
    item,
    actionButton = undefined,
    driver,
    navigation,
    // toggleBottomSheet,
    duration,
    distance,
    displayButtons = true,
    onCancelClick = undefined,
  }: BookingDetailPanelProps) => {
    // const { user } = useContext(UserContext);
    // console.log(item.status);
    return (
      <Box>
        <TripFullInformation
          item={item}
          distance={distance}
          duration={duration}
          driver={driver}
        />
        {displayButtons && (
          <VStack>
            <HStack>
              <View
                style={[
                  styles.cardInsideLocation,
                  {
                    backgroundColor: themeColors.primary,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  vigoStyles.buttonWhite,
                ]}
              >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <HStack alignItems="center">
                    <ArrowLeftIcon size={20} color={themeColors.primary} />
                    <Text marginLeft={2} style={vigoStyles.buttonWhiteText}>
                      Quay lại
                    </Text>
                  </HStack>
                </TouchableOpacity>
              </View>
              {actionButton && actionButton}
            </HStack>
            {item.status == "ASSIGNED" && (
              <HStack>
                <View
                  flex={1}
                  style={[
                    styles.cardInsideLocation,
                    vigoStyles.buttonWhite,
                    {
                      // backgroundColor: "red",
                      height: 40,
                      justifyContent: "center",
                      alignItems: "center",
                      borderColor: "red",
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (onCancelClick != undefined) {
                        onCancelClick();
                      }
                    }}
                  >
                    <HStack alignItems="center">
                      <XCircleIcon size={20} color={"red"} />
                      <Text marginLeft={2} color="red.500" bold>
                        Hủy nhận chuyến
                      </Text>
                    </HStack>
                  </TouchableOpacity>
                </View>
              </HStack>
            )}
          </VStack>
        )}
      </Box>
    );
  }
);

interface BookingDetailSmallPanelProps {
  item: any;
  actionButton?: ReactNode;
  navigation: any;
}
const BookingDetailSmallPanel = memo(
  ({ item, actionButton, navigation }: BookingDetailSmallPanelProps) => {
    // const { user } = useContext(UserContext);
    // console.log(item);
    return (
      <Box>
        <TripBasicInformation item={item} />
        <HStack>
          <View
            style={[
              styles.cardInsideLocation,
              {
                backgroundColor: themeColors.primary,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              },
              vigoStyles.buttonWhite,
            ]}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <HStack alignItems="center">
                <ArrowLeftIcon size={20} color={themeColors.primary} />
                <Text marginLeft={2} style={vigoStyles.buttonWhiteText}>
                  Quay lại
                </Text>
              </HStack>
            </TouchableOpacity>
          </View>
          {actionButton && actionButton}
        </HStack>
      </Box>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 15,
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
    flexDirection: "column", // inner items will be added vertically
    flexGrow: 1, // all the available vertical space will be occupied by it
    justifyContent: "space-between", // will create the gutter between body and footer
  },
  cardInsideDateTime: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,

    paddingHorizontal: 15,
    width: "40%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    // flexGrow: 1,
    margin: 5,
  },
  cardInsideLocation: {
    // flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 8,

    paddingHorizontal: 20,
    width: "40%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

    margin: 5,
  },
  body: {
    flex: 1,
  },
  title: {
    color: themeColors.primary,
    fontSize: 16,
    fontWeight: "bold",
    // paddingLeft: 10,
  },
  list: {
    paddingTop: 10,
    fontSize: 20,
  },
  titlePrice: {
    // fontSize: 15,
    fontWeight: "bold",
    color: themeColors.primary,
    textAlign: "right",
  },
});

export { BookingDetailSmallPanel };
export default BookingDetailPanel;

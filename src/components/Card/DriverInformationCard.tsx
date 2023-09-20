import { Box, HStack, Image, Pressable, Text, VStack } from "native-base";
import { calculateAge } from "../../utils/datetimeUtils";
import { toPercent } from "../../utils/numberUtils";
import { ColorType } from "native-base/lib/typescript/components/types";
import { PhoneArrowUpRightIcon } from "react-native-heroicons/outline";
import { themeColors } from "../../assets/theme";
import call from "react-native-phone-call";
import { handleError } from "../../utils/alertUtils";
import { getCancelRateTextColor } from "../../utils/userUtils";
import { useNavigation } from "@react-navigation/native";
import { memo } from "react";
import { ChatBubbleLeftRightIcon } from "react-native-heroicons/outline";
interface DriverInformationCardProps {
  driver: any;
  displayDriverText?: boolean | undefined;
  displayCall?: boolean;
  bookingDetailId?: string;
}

const DriverInformationCard = ({
  driver,
  displayDriverText = true,
  displayCall = false,
  bookingDetailId = undefined,
}: DriverInformationCardProps) => {
  const navigation = useNavigation();

  console.log("Driver ", driver)
  const handleCall = (phoneNumber: string) => {
    const args = {
      number: phoneNumber,
      prompt: true,
    };
    try {
      call(args);
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
    }
  };

  return (
    <>
      {driver && (
        <>
          <HStack alignItems="center">
            <Image
              source={
                driver.avatarUrl
                  ? { uri: driver.avatarUrl }
                  : require("../../assets/images/no-image.jpg")
              }
              // style={styles.image}
              alt="Ảnh đại diện"
              size={60}
              borderRadius={100}
            />
            <VStack paddingLeft={5}>
              {displayDriverText && (
                <Text>
                  Tài xế <Text bold>{driver.name}</Text>
                </Text>
              )}
              {!displayDriverText && <Text bold>{driver.name}</Text>}
              <HStack>
                <Text>
                  {`${driver.gender == true ? "Nam" : "Nữ"}${driver.dateOfBirth
                    ? ` | ${calculateAge(driver.dateOfBirth)} tuổi`
                    : ""
                    }`}
                </Text>
              </HStack>
              <Text>
                Tỉ lệ hủy chuyến:{" "}
                <Text color={getCancelRateTextColor(driver.canceledTripRate)}>
                  {toPercent(driver.canceledTripRate)}
                </Text>
              </Text>
            </VStack>
          </HStack>

          {displayCall && (
            <HStack justifyContent="flex-end" mt="2">
              <Box
                borderWidth={1}
                rounded="md"
                p="1"
                borderColor={themeColors.primary}
              >
                <Pressable onPress={() => handleCall(driver.phone)}>
                  <PhoneArrowUpRightIcon
                    size={25}
                    color={themeColors.primary}
                  />
                </Pressable>
              </Box>

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
                      bookingDetailId: bookingDetailId,
                      driver: driver,
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
        </>
      )}
    </>
  );
};

export default memo(DriverInformationCard);

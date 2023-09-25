import React, { memo, useState } from "react";
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
  Card,
  CardItem,
  Tooltip,
  Button,
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
  PhoneArrowUpRightIcon,
  FlagIcon,
} from "react-native-heroicons/solid";
import { toVnDateString, toVnTimeString } from "../../utils/datetimeUtils";
import { vndFormat } from "../../utils/numberUtils";
import {
  ChatBubbleLeftRightIcon,
  StarIcon,
  XCircleIcon,
  MapPinIcon,
} from "react-native-heroicons/outline";
import ConfirmAlert from "../Alert/ConfirmAlert";
import {
  cancelBookingDetail,
  getCancelFee,
} from "../../service/bookingDetailService";
import ViGoSpinner from "../Spinner/ViGoSpinner";
import { eventNames, handleError } from "../../utils/alertUtils";
import { NativeEventEmitter } from "react-native";
import ReportModal from "../Modal/ReportModal";
import call from "react-native-phone-call";

const CardBookingDetail = ({ item }) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [cancelFee, setCancelFee] = useState(0);

  const handleConfirmCancelTrip = async () => {
    // const bookingId = bookingDetail.bookingId;
    const eventEmitter = new NativeEventEmitter();
    try {
      setIsLoading(true);
      const response = await cancelBookingDetail(item.id);
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

  const handleCall = (phoneNumber) => {
    const args = {
      number: phoneNumber,
      prompt: true,
    };
    try {
      call(args);
    } catch (error) {
      handleError("Có lỗi xảy ra", error, navigation);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <Center flex={1}>
      <ViGoSpinner isLoading={isLoading} key="spinner-navigation" />
      <Box
        borderBottomWidth={1}
        borderColor={themeColors.primary}
        p={4}
        width="full"
      >
        {/* Row 1 */}
        <HStack space={4} alignItems="center">
          <ClockIcon size={20} color="#00A1A1" />
          <Text w={100} marginLeft={2} bold color="gray.500">
            Giờ đón
          </Text>
          <Text marginLeft={2} bold color="black">
            {item.customerRouteRoutine.pickupTime}
          </Text>
        </HStack>

        {/* Row 2 */}
        <HStack space={4} alignItems="center">
          <CalendarIcon size={20} color="#00A1A1" />
          <Text w={100} marginLeft={2} bold color="gray.500">
            Ngày đón
          </Text>
          <Text marginLeft={2} bold color="black">
            {item.customerRouteRoutine.routineDate}
          </Text>
        </HStack>

        {/* Row 3 */}
        <HStack space={4} alignItems="center">
          <UserIcon size={20} color="#00A1A1" />
          <Text w={100} marginLeft={2} bold color="gray.500">
            Tài xế
          </Text>
          <Text marginLeft={2} bold color="black">
            {item.driver == null ? "Chưa có tài xế" : item.driver.name}
          </Text>
        </HStack>

        {/* Row 4 */}
        <HStack space={4} alignItems="center">
          <PhoneIcon size={20} color="#00A1A1" />
          <Text w={100} marginLeft={2} bold color="gray.500">
            Số điện thoại
          </Text>
          <Text marginLeft={2} bold color="black">
            {item.driver == null ? "Chưa có tài xế" : item.driver.phone}
          </Text>
        </HStack>

        {/* Row 5 */}
        <VStack mt={2} space={4} alignItems="flex-end">
          <HStack space={4} alignItems="flex-end">
            {/* {item.driver !== null && (
              
            )} */}
            {item.driver !== null &&
              item.status !== "COMPLETED" &&
              item.status !== "CANCELLED" && (
                <HStack space={4}>
                  <Pressable onPress={toggleModal}>
                    <FlagIcon size={25} color={themeColors.primary} />
                  </Pressable>
                  <Tooltip label="Nhắn tin" placement="auto">
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
                  </Tooltip>
                  <Tooltip label="Gọi điện" openDelay={500}>
                    <Pressable onPress={() => handleCall(item.driver.phone)}>
                      <PhoneArrowUpRightIcon
                        size={25}
                        color={themeColors.primary}
                      />
                    </Pressable>
                  </Tooltip>
                </HStack>
              )}
            {(item.status === "COMPLETED" ||
              item.status === "ARRIVE_AT_DROPOFF") && (
              <Tooltip label="Đánh giá" placement="auto">
                <Pressable
                  onPress={() =>
                    navigation.navigate("Feedback", {
                      bookingDetailId: item.id,
                    })
                  }
                >
                  <StarIcon size={25} color={themeColors.primary} />
                </Pressable>
              </Tooltip>
            )}
            {(item.status === "PENDING_ASSIGN" ||
              item.status === "ASSIGNED") && (
              <Tooltip label="Hủy chuyến" openDelay={500}>
                <Pressable onPress={openConfirmCancelTrip}>
                  <XCircleIcon size={25} color={themeColors.primary} />
                </Pressable>
              </Tooltip>
            )}
          </HStack>
        </VStack>
        <CancelBookingDetailConfirmAlert
          key={"cancel-trip-modal"}
          confirmOpen={isCancelConfirmOpen}
          setConfirmOpen={setIsCancelConfirmOpen}
          handleOkPress={() => handleConfirmCancelTrip()}
          cancelFee={cancelFee}
        />
        {/* <ReportModal isVisible={modalVisible} closeModal={closeModal} /> */}
        <ReportModal
          bookingDetailId={item.id}
          isOpen={isModalOpen}
          onClose={toggleModal}
        />
      </Box>
    </Center>
  );
};

const styles = StyleSheet.create({
  cardInsideDateTime: {
    // flexGrow: 1,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: themeColors.primary,
  },
});
export default memo(CardBookingDetail);

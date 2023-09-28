import { Box, HStack, Modal, Text, VStack } from "native-base";
import { Dispatch, SetStateAction, memo } from "react";
import {
  getDayOfWeek,
  toVnDateString,
  toVnTimeString,
} from "../../utils/datetimeUtils";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { MarkedDates } from "react-native-calendars/src/types";
import { themeColors } from "../../assets/theme";
import { ArrowLeftIcon, ArrowRightIcon } from "react-native-heroicons/solid";

interface ViewRoutinesModalProps {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  routines: any[];
  tripType: "ONE_WAY" | "ROUND_TRIP";
}

const ViewRoutinesModal = ({
  modalVisible,
  setModalVisible,
  routines,
  tripType,
}: ViewRoutinesModalProps) => {
  console.log(routines);
  const renderRoutine = (routine: any) => {
    const dayOfWeek = getDayOfWeek(routine.routineDate);

    const dateTimeString = `${toVnTimeString(
      routine.pickupTime
    )} ${toVnDateString(routine.routineDate)}`;

    return (
      <Text key={dateTimeString}>{`${dayOfWeek}, ${dateTimeString}`}</Text>
    );
  };

  const routineDates = routines.map((routine: any) =>
    moment(routine.routineDate).format("YYYY-MM-DD").toString()
  );

  let markedDates = {} as MarkedDates;
  routineDates.forEach((date: any) => {
    markedDates[date] = {
      marked: true,
    };
  });

  const theme = {
    // Customize the agenda styles
    agendaKnobColor: themeColors.primary,
    selectedDayBackgroundColor: themeColors.primary,
    dotColor: "red",
    todayTextColor: "green",
    agendaTodayColor: themeColors.primary,
    // Add more style customizations as needed
  };

  return (
    <Modal
      isOpen={modalVisible}
      onClose={() => {
        setModalVisible(false);
      }}
      size={"xl"}
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Danh sách các chuyến đi</Modal.Header>
        <Modal.Body>
          {/* {routines &&
            routines.map((routine: any) => (
              <HStack m="2">{renderRoutine(routine)}</HStack>
            ))} */}
          <VStack mb="2">
            <Text>
              Chuyến đi đầu tiên vào ngày{" "}
              <Text bold>
                {moment(routineDates[0]).format("DD-MM-YYYY").toString()}
              </Text>
            </Text>
            <Text>
              Chuyến đi cuối cùng vào ngày{" "}
              <Text bold>
                {moment(routineDates[routineDates.length - 1])
                  .format("DD-MM-YYYY")
                  .toString()}
              </Text>
            </Text>
            {tripType == "ONE_WAY" && (
              <Text>
                Giờ đón:{" "}
                <Text bold>{toVnTimeString(routines[0].pickupTime)}</Text>
              </Text>
            )}
            {tripType == "ROUND_TRIP" && (
              <VStack>
                <Text>
                  Giờ đón chiều đi:{" "}
                  <Text bold>{toVnTimeString(routines[0].pickupTime)}</Text>
                </Text>
                <Text>
                  Giờ đón chiều về:{" "}
                  <Text bold>
                    {toVnTimeString(routines[routines.length - 1].pickupTime)}
                  </Text>
                </Text>
              </VStack>
            )}
            <Text>
              Tổng số chuyến đi: <Text bold>{routines.length}</Text>
            </Text>
          </VStack>
          <Calendar
            initialDate={routineDates[0]}
            minDate={routineDates[0]}
            maxDate={routineDates[routineDates.length - 1]}
            firstDay={1}
            markedDates={markedDates}
            theme={theme}
            renderArrow={(directions) =>
              directions == "left" ? (
                <ArrowLeftIcon color={themeColors.primary} size={20} />
              ) : (
                <ArrowRightIcon color={themeColors.primary} size={20} />
              )
            }
          />
          <HStack mt="1" justifyContent="flex-end">
            <Text maxW="100%" fontSize="xs" textAlign={"right"} italic>
              Các ngày được đánh dấu là những ngày có chuyến đi bạn chọn
            </Text>
          </HStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default memo(ViewRoutinesModal);

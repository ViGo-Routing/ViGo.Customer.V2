import { Box, HStack, Heading, Image, Modal, Text, VStack } from "native-base";
import {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useKeyboard } from "../../hooks/useKeyboard";
import ViGoSpinner from "../Spinner/ViGoSpinner";
import { getErrorMessage, handleError } from "../../utils/alertUtils";
import { getFarePolicies, getVehicleFare } from "../../service/fareService";
import { bikeVehicleTypeId } from "../../service/vehicleTypeService";
import { toPercent, vndFormat } from "../../utils/numberUtils";
import { getSettings, settingKeys } from "../../service/settingService";
import {
  CalendarDaysIcon,
  InformationCircleIcon,
} from "react-native-heroicons/outline";
import { themeColors } from "../../assets/theme";

interface FareModalProps {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}

const FareModal = ({ modalVisible, setModalVisible }: FareModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isKeyboardVisible } = useKeyboard();

  const [fare, setFare] = useState(null as any);
  const [farePolicies, setFarePolicies] = useState([] as any[]);

  const [additionalFare, setAdditionalFare] = useState(0);

  const [twoWeekly, setTwoWeekly] = useState(0);
  const [fiveWeekly, setFiveWeekly] = useState(0);
  const [twoMonthly, setTwoMonthly] = useState(0);
  const [fourMonthly, setFourMonthly] = useState(0);
  const [sixMonthly, setSixMonthly] = useState(0);

  const getFareInformation = useCallback(async () => {
    // console.log("Get fare");
    try {
      setIsLoading(true);
      const fareResponse = await getVehicleFare(bikeVehicleTypeId);
      setFare(fareResponse);
      const farePolicies = await getFarePolicies(fareResponse.id);
      setFarePolicies(farePolicies);

      const settings = await getSettings();
      setAdditionalFare(
        settings.find(
          (setting: any) => setting.key === settingKeys.NightTripExtraFeeBike
        ).value
      );
      setTwoWeekly(
        settings.find(
          (setting: any) => setting.key === settingKeys.TwoWeeklyTicketsDiscount
        ).value
      );
      setFiveWeekly(
        settings.find(
          (setting: any) =>
            setting.key === settingKeys.FiveWeeklyTicketsDiscount
        ).value
      );
      setTwoMonthly(
        settings.find(
          (setting: any) =>
            setting.key === settingKeys.TwoMonthlyTicketsDiscount
        ).value
      );
      setFourMonthly(
        settings.find(
          (setting: any) =>
            setting.key === settingKeys.FourMonthlyTicketsDiscount
        ).value
      );
      setSixMonthly(
        settings.find(
          (setting: any) =>
            setting.key === settingKeys.SixMonthlyTicketsDiscount
        ).value
      );
    } catch (error) {
      handleError("Có lỗi xảy ra", getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getFareInformation();
  }, []);

  return (
    <Modal
      isOpen={modalVisible}
      onClose={() => {
        setModalVisible(false);
      }}
      size={"xl"}
      pb={isKeyboardVisible ? "50%" : "0"}
    >
      <Modal.Content>
        <ViGoSpinner isLoading={isLoading} />
        <Modal.CloseButton />
        <Modal.Header>Thông tin biểu phí ViGo</Modal.Header>
        <Modal.Body>
          <HStack justifyContent="center" alignItems="center">
            <Image
              source={require("../../assets/icons/BikeIcon.png")}
              size={"md"}
              alt="vigo-bike-icon"
            />
          </HStack>
          <Box>
            <Heading mb="1" mt="2" size="sm" color={themeColors.primary}>
              Biểu phí tính theo km dành cho xe máy
            </Heading>
            <Box ml="2">
              {fare && (
                <Box>
                  <Text>
                    <Text bold>{fare.baseDistance} km đầu tiên: </Text>{" "}
                    {vndFormat(fare.basePrice)}
                  </Text>
                </Box>
              )}
              {farePolicies && (
                <Box>
                  {farePolicies.map((policy) => {
                    if (policy.maxDistance != null) {
                      return (
                        <Text key={policy.id}>
                          Từ <Text bold>{policy.minDistance} km</Text> đến{" "}
                          <Text bold>{policy.maxDistance} km</Text>:{" "}
                          {vndFormat(policy.pricePerKm)} / km
                        </Text>
                      );
                    } else {
                      return (
                        <Text key={policy.id}>
                          Từ <Text bold>{policy.minDistance} km</Text> trở lên:{" "}
                          {vndFormat(policy.pricePerKm)} / km
                        </Text>
                      );
                    }
                  })}
                </Box>
              )}
              {additionalFare && (
                <HStack mt="1" alignItems="flex-start">
                  <InformationCircleIcon
                    style={{ marginTop: 4 }}
                    color="black"
                    size={17}
                  />
                  <Text ml="1" italic>
                    Phụ thu chuyến đi ban đêm (từ 22h00 đến 06h00 sáng hôm sau):{" "}
                    <Text bold>{vndFormat(additionalFare)} / chuyến</Text>
                  </Text>
                </HStack>
              )}
            </Box>
          </Box>
          <Box>
            <Heading mb="1" mt="3" size="sm" color={themeColors.primary}>
              Chính sách giảm giá theo hành trình
            </Heading>
            <Box ml="2">
              <VStack>
                <HStack>
                  <CalendarDaysIcon color="black" size={17} />
                  <Heading ml="1" size="xs">
                    Theo tuần
                  </Heading>
                </HStack>
                <VStack ml="2">
                  <Text>
                    Từ <Text bold>2 tuần</Text> trở lên: giảm{" "}
                    {toPercent(twoWeekly, 0)}
                  </Text>
                  <Text>
                    Từ <Text bold>5 tuần</Text> trở lên: giảm{" "}
                    {toPercent(fiveWeekly, 0)}
                  </Text>
                </VStack>
              </VStack>
              <VStack mt="2">
                <HStack>
                  <CalendarDaysIcon color="black" size={17} />
                  <Heading ml="1" size="xs">
                    Theo tháng
                  </Heading>
                </HStack>
                <VStack ml="2">
                  <Text>
                    Từ <Text bold>2 tháng</Text> trở lên: giảm{" "}
                    {toPercent(twoMonthly, 0)}
                  </Text>
                  <Text>
                    Từ <Text bold>4 tháng</Text> trở lên: giảm{" "}
                    {toPercent(fourMonthly, 0)}
                  </Text>
                  <Text>
                    Từ <Text bold>6 tháng</Text> trở lên: giảm{" "}
                    {toPercent(sixMonthly, 0)}
                  </Text>
                </VStack>
              </VStack>
              <HStack mt="1" alignItems="flex-start">
                <InformationCircleIcon
                  style={{ marginTop: 4 }}
                  color="black"
                  size={17}
                />
                <Text ml="1" italic>
                  Tổng số chuyến đi mỗi tuần phải từ 4 chuyến đi trở lên mới
                  được hưởng chính sách giảm giá.
                </Text>
              </HStack>
            </Box>
          </Box>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default memo(FareModal);

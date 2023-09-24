import {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { handleError } from "../../utils/alertUtils";
import { getMetroStations } from "../../service/stationService";
import {
  Box,
  FormControl,
  HStack,
  Modal,
  Select,
  Text,
  VStack,
} from "native-base";
import { useKeyboard } from "../../hooks/useKeyboard";
import ViGoGooglePlacesAutocomplete from "./ViGoGooglePlacesAutocomplete";
import { TouchableOpacity } from "react-native";
import { vigoStyles } from "../../assets/theme";

interface ViGoStationSelectProps {
  selectedStation?: SelectStationItem;
  displayName: string;
  placeholder: string;
  setSelectedStation: Dispatch<SetStateAction<SelectStationItem | null>>;
}

export interface FilterOption {
  text: string;
  value: string;
}
export interface SelectStationItem {
  name: string;
  value: string;
  address: string;
  type: "METRO" | "OTHER";
  latitude: number;
  longitude: number;
}

const ViGoStationSelect = ({
  selectedStation = undefined,
  displayName,
  placeholder,
  setSelectedStation,
}: ViGoStationSelectProps) => {
  const [metroStations, setMetroStations] = useState([] as any[]);
  const [selectStations, setSelectStations] = useState([] as FilterOption[]);

  const [modalVisible, setModalVisible] = useState(false);
  const { isKeyboardVisible } = useKeyboard();

  const [details, setDetails] = useState(null as any);

  const getStations = useCallback(async () => {
    try {
      const metroResponse = await getMetroStations();
      setMetroStations(metroResponse);

      let options = metroResponse.map((station: any) => {
        return {
          text: station.name,
          value: station.id,
        } as FilterOption;
      });
      options.push({
        text: "Khác",
        value: "other",
      } as FilterOption);
      setSelectStations(options);
    } catch (error) {
      handleError("Có lỗi xảy ra", error);
    }
  }, []);

  useEffect(() => {
    getStations();
  }, []);

  const handleSelectStation = (
    item: string,
    setSelection: Dispatch<SetStateAction<SelectStationItem | null>>
  ) => {
    if (item == "other") {
      // setSelection({
      //   type: "OTHER",
      //   name: "other",
      //   address: "other",
      //   value: "other",
      //   latitude: 0,
      //   longitude: 0,
      // });
      setModalVisible(true);
    } else {
      const station = metroStations.find((value) => value.id == item);
      setSelection({
        type: "METRO",
        name: station.name,
        address: station.address,
        value: station.id,
        latitude: station.latitude,
        longitude: station.longitude,
      });
    }
  };

  const handleModalConfirm = (
    details: any,
    setSelection: Dispatch<SetStateAction<SelectStationItem | null>>
  ) => {
    console.log(details);
    setSelection({
      address: details.formatted_address,
      name: details.name,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      type: "OTHER",
      value: "other",
    });
  };

  return (
    <VStack>
      <FormControl>
        <HStack>
          <FormControl.Label mr="2">{displayName}</FormControl.Label>
          <Select
            py="1"
            flex={1}
            accessibilityLabel={placeholder}
            placeholder={placeholder}
            selectedValue={selectedStation?.value}
            onValueChange={(item) => {
              handleSelectStation(item, setSelectedStation);
            }}
            backgroundColor={"white"}
          >
            {selectStations.map((item) => (
              <Select.Item
                label={item.text}
                value={`${item.value}`}
                key={`${item.value}`}
              />
            ))}
          </Select>
        </HStack>
        {selectedStation && (
          <VStack mt="3">
            <Text>
              <Text bold>Địa chỉ: </Text>
              {`${selectedStation.name}, ${selectedStation.address}`}
            </Text>
          </VStack>
        )}
      </FormControl>
      <Modal
        isOpen={modalVisible}
        // onClose={() => {
        //   setModalVisible(false);
        // }}
        size={"xl"}
        // avoidKeyboard={true}
        pb={isKeyboardVisible ? "50%" : "0"}
        // closeOnOverlayClick={false}
      >
        <Modal.Content>
          {/* <Modal.CloseButton /> */}
          <Modal.Header>Chọn vị trí</Modal.Header>
          <Modal.Body
            _scrollview={{
              keyboardShouldPersistTaps: "handled",
              scrollEnabled: true,
            }}
          >
            <ViGoGooglePlacesAutocomplete
              selectedPlace={null}
              handlePlaceSelection={(details) => {
                setDetails(details);
              }}
              isInScrollView={true}
            />

            {details && (
              <VStack ml="2">
                <Text>
                  <Text bold>Tên: </Text>
                  {details.name}
                </Text>
                <Text>
                  <Text bold>Địa chỉ: </Text>
                  {details.formatted_address}
                </Text>
              </VStack>
            )}
          </Modal.Body>
          <Modal.Footer>
            <TouchableOpacity
              style={{ ...vigoStyles.buttonPrimary }}
              onPress={() => {
                setModalVisible(!modalVisible);
                handleModalConfirm(details, setSelectedStation);
              }}
              // disabled={isAmountInvalid}
              // activeOpacity={amount <= 1000 ? 1 : 0.7}
            >
              <Text style={vigoStyles.buttonPrimaryText}>Xác nhận</Text>
            </TouchableOpacity>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </VStack>
  );
};

export default memo(ViGoStationSelect);

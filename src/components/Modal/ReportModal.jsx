import React, { memo, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Pressable,
  Select,
  Text,
  TextArea,
  Toast,
  View,
} from "native-base";
import { XMarkIcon } from "react-native-heroicons/solid";
import { createReport } from "../../service/reportService";
import { useNavigation } from "@react-navigation/native";

function ReportModal({ bookingDetailId, isOpen, onClose }) {
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("DRIVER_NOT_COMING");
  const [textareaValue, setTextareaValue] = useState("");
  const navigation = useNavigation();
  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const handleSelectChange = (value) => {
    setSelectedValue(value);
  };

  const handleTextareaChange = (text) => {
    setTextareaValue(text);
  };
  const handleCreateReport = async () => {
    let request = {
      title: inputValue,
      content: textareaValue,
      type: selectedValue,
      bookingDetailId: bookingDetailId,
    };
    console.log("request", request);
    const response = await createReport(request);
    if (response != null) {
      //reset field input
      setInputValue("");
      setSelectedValue("DRIVER_NOT_COMING");
      setTextareaValue("");
      navi;
      Toast.show({
        title: "Báo cáo thành công",
        variant: "top-accent",
        description: "Cảm ơn bạn đã báo cáo ",
        placement: "bottom",
      });
      navigation.navigate("ReportDetail", {
        reportId: response.id,
      });
      onClose();
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content>
        <Modal.Header>
          <Text bold fontSize={25}>
            Tạo báo cáo
          </Text>
          <Pressable
            position="absolute"
            top={0}
            right={2}
            onPress={onClose}
            mt={4}
            colorScheme="blue"
          >
            <XMarkIcon color="gray" />
          </Pressable>
        </Modal.Header>
        <Modal.Body>
          <View p={4}>
            <Text mb={2}>Tiêu đề</Text>
            <Input
              placeholder="Nhập tiêu đề"
              value={inputValue}
              onChangeText={handleInputChange}
            />
            <Text mt={2}>Loại báo cáo</Text>
            <Select
              selectedValue={selectedValue}
              onValueChange={handleSelectChange}
            >
              <Select.Item label="Tài xế không đến" value="DRIVER_NOT_COMING" />
              <Select.Item label="Khác" value="OTHER" />
            </Select>
            <Text mt={2}>Nhập báo cáo: </Text>
            <TextArea
              placeholder="Cụ thể..."
              value={textareaValue}
              onChangeText={handleTextareaChange}
            />
          </View>
        </Modal.Body>
        <Modal.Footer>
          <Button onPress={handleCreateReport}>Gửi báo cáo</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

export default memo(ReportModal);

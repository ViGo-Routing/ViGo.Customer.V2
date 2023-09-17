import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

// IMPORT COMPONENTS
import Header from "../../components/Header/Header";
import Profile from "../../components/Profile/Profile";
import { useNavigation } from "@react-navigation/native";
import { themeColors, vigoStyles } from "../../assets/theme/index";
import {
  View,
  VStack,
  HStack,
  Pressable,
  Image,
  Box,
  FormControl,
  Input,
  Select,
  Text,
  ScrollView,
} from "native-base";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import { SafeAreaView } from "react-native";
import {
  eventNames,
  getErrorMessage,
  handleError,
  handleWarning,
} from "../../utils/alertUtils";
import { editProfile, getProfile } from "../../service/userService";
import { UserContext } from "../../context/UserContext";
import { generateImageName } from "../../utils/imageUtils";
import { uploadFile } from "../../utils/firebaseUtils";
import { launchImageLibrary } from "react-native-image-picker";
import { getMaximumDob } from "../../utils/datetimeUtils";
import { NativeEventEmitter } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { PencilSquareIcon } from "react-native-heroicons/outline";

const availableGender = [
  { label: "Nam", value: true },
  { label: "Nữ", value: false },
];

const EditProfileScreen = () => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();

  const [showPicker, setShowpicker] = useState(false);

  const formatDate = (rawDate: any) => {
    let date = new Date(rawDate);
    // console.log(dob);

    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);

    return `${day}/${month}/${year}`;
  };

  const toggleDatepicker = () => {
    setShowpicker(!showPicker);
  };

  const { user, setUser } = useContext(UserContext);
  const [avatarSource, setAvatarSource] = useState(
    user?.avatarUrl as string | null
  );
  const [name, setName] = useState(user?.name as string);
  const [email, setEmail] = useState(user?.email as string);

  const [gender, setGender] = useState(user?.gender as boolean);
  const defaultDob =
    user?.dateOfBirth != null ? new Date(user?.dateOfBirth) : getMaximumDob();
  // console.log(defaultDob);

  const [dob, setDob] = useState(defaultDob as Date | undefined);
  const eventEmitter = new NativeEventEmitter();

  const getUserData = async () => {
    try {
      setIsLoading(true);
      const profile = await getProfile(user.id);
      if (profile) {
        setName(profile.name);
        setEmail(profile.email);
        setGender(profile.gender);
        setDob(new Date(profile.dateOfBirth));
        setAvatarSource(profile.avatarUrl);
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handlePickAvatar = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      maxWidth: 500,
      maxHeight: 500,
    });

    if (result.errorMessage) {
      // Alert.alert("Có lỗi xảy ra", "Chi tiết: " + result.errorMessage);
      handleError("Có lỗi xảy ra", result.errorMessage, navigation);
    } else {
      if (result.assets) {
        setIsLoading(true);
        // console.log(result.assets[0].uri);
        try {
          const imageUri = result.assets[0].uri;
          const fileName = `customer_avatar_${generateImageName(10)}.png`;

          const { task, ref } = await uploadFile(imageUri, fileName);

          // task.on('state_changed', taskSnapshot => {

          // });

          task.then(async () => {
            setIsLoading(true);
            // return ref.getDownloadURL();
            // console.log("Upload success");
            const downloadUrl = await ref.getDownloadURL();
            if (downloadUrl) {
              setIsLoading(false);
              setAvatarSource(downloadUrl);
              console.log(downloadUrl);
              // toast.show({
              //   description: "Tải ảnh lên thành công",
              //   duration: 2000,
              // });
              eventEmitter.emit(eventNames.SHOW_TOAST, {
                title: "Tải ảnh lên thành công",
                description: "",
                status: "info",
                // placement: "bottom",
                duration: 3000,
                isSlide: true,
              });
            }
          });
        } catch (error) {
          // Alert.alert("Có lỗi xảy ra", "Chi tiết: " + error.message);
          handleError("Có lỗi xảy ra", error);
          setIsLoading(false);
        } finally {
          // setIsLoading(false);
        }
      }
    }
  };

  const updateProfile = async () => {
    if (avatarSource && name && email && dob) {
      try {
        setIsLoading(true);

        const profileToUpdate = {
          email: email,
          name: name,
          gender: gender,
          dateOfBirth: dob,
          avatarUrl: avatarSource,
        };

        // console.log(profileToUpdate);
        const profileData = await editProfile(user.id, profileToUpdate);

        eventEmitter.emit(eventNames.SHOW_TOAST, {
          title: "Cập nhật thông tin thành công",
          description: "Các thông tin của bạn đã được cập nhật thành công!",
          status: "success",
          // placement: "top",
          isDialog: true,
          onOkPress: async () => {
            // await removeItem("token");
            // await auth().signOut();

            // // await setUserData(null);
            // setUser(null);

            // navigation.reset({
            //   index: 0,
            //   routes: [{ name: "Login" }],
            // });
            setUser(profileData);
            await getUserData();
          },
        });
      } catch (error) {
        handleError("Có lỗi xảy ra", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!avatarSource) {
        handleWarning(
          "Thiếu thông tin",
          "Vui lòng tải lên ảnh đại diện của bạn!"
        );
      }
      if (!name || name.length <= 5) {
        handleWarning("Thiếu thông tin", "Họ và tên phải có ít nhất 5 kí tự!");
      }
      if (!email) {
        handleWarning("Thiếu thông tin", "Vui lòng nhập email!");
      }
      if (!dob) {
        handleWarning("Thiếu thông tin", "Vui lòng chọn ngày tháng năm sinh!");
      }
    }
  };

  return (
    <SafeAreaView style={vigoStyles.container}>
      <Header title="Chỉnh sửa thông tin" />
      <View style={vigoStyles.body}>
        <ViGoSpinner isLoading={isLoading} />
        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          <ScrollView>
            <VStack pt={4} pb="4">
              <View style={{ alignItems: "center" }}>
                <Pressable onPress={() => handlePickAvatar()}>
                  <Image
                    source={
                      avatarSource
                        ? { uri: avatarSource }
                        : require("../../assets/images/no-image.jpg")
                    }
                    // style={styles.image}
                    alt="Ảnh đại diện"
                    size={100}
                    borderRadius={100}
                  />
                </Pressable>
              </View>

              <Box>
                <Box marginTop={3}>
                  <FormControl>
                    <FormControl.Label>Số điện thoại</FormControl.Label>
                    <Input
                      value={user?.phone}
                      // editable={false}
                      isReadOnly={true}
                      variant={"filled"}
                      // style={styles.input}
                    />
                  </FormControl>
                </Box>

                <Box marginTop={3}>
                  <FormControl>
                    <FormControl.Label>Họ và tên</FormControl.Label>
                    <Input
                      placeholder="Nhập họ và tên"
                      value={name}
                      autoComplete="name"
                      keyboardType="default"
                      textContentType="name"
                      onChangeText={setName}
                      // variant={"filled"}
                      // style={{ backgroundColor: "white" }}
                      style={styles.input}
                    />
                  </FormControl>
                </Box>

                <Box marginTop={3}>
                  <FormControl>
                    <FormControl.Label>Giới tính</FormControl.Label>
                    <Select
                      accessibilityLabel="Nam hoặc nữ"
                      placeholder="Nam hoặc nữ"
                      selectedValue={`${gender}`}
                      onValueChange={(item) => setGender(item == "true")}
                      // color={"white"}
                      backgroundColor={"white"}
                    >
                      {availableGender.map((item) => (
                        <Select.Item
                          label={item.label}
                          value={`${item.value}`}
                          key={`${item.value}`}
                        />
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box marginTop={3}>
                  <FormControl>
                    <FormControl.Label>Ngày sinh</FormControl.Label>
                    <Pressable
                      // disabled={isSubmitted == true}
                      onPress={toggleDatepicker}
                    >
                      <Input
                        placeholder="Nhập ngày sinh"
                        value={dob ? formatDate(dob) : ""}
                        // onChangeText={setDob}
                        style={styles.input}
                        isReadOnly={true}
                      />
                    </Pressable>
                    {showPicker && (
                      <RNDateTimePicker
                        mode="date"
                        onChange={(event, date) => {
                          toggleDatepicker();
                          // console.log(date);
                          setDob(date);
                        }}
                        value={dob}
                        maximumDate={getMaximumDob()}
                        negativeButton={{ label: "Hủy" }}
                        positiveButton={{ label: "Xác nhận" }}
                      />
                    )}
                  </FormControl>
                </Box>

                <Box marginTop={3}>
                  <FormControl>
                    <FormControl.Label>Địa chỉ email</FormControl.Label>
                    <Input
                      placeholder="Nhập địa chỉ email"
                      value={email}
                      autoComplete="email"
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      onChangeText={setEmail}
                      // variant={"filled"}
                      // style={{ backgroundColor: "white" }}
                      style={styles.input}
                    />
                  </FormControl>
                </Box>
              </Box>
            </VStack>
          </ScrollView>
          <HStack mt="5">
            <TouchableOpacity
              style={[vigoStyles.buttonPrimary, { flex: 1 }]}
              onPress={() => updateProfile()}
              // disabled={isAmountInvalid}
            >
              <HStack alignItems="center" justifyContent="center">
                <PencilSquareIcon color={"white"} size={25} />
                <Text ml="2" style={vigoStyles.buttonPrimaryText}>
                  Cập nhật
                </Text>
              </HStack>
            </TouchableOpacity>
          </HStack>
        </ErrorAlert>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
  },
});

export default EditProfileScreen;

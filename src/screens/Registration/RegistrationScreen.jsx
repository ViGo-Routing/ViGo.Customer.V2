import React from "react";
import {
  SafeAreaView,
  // Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  // Alert,
  PermissionsAndroid,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { themeColors, vigoStyles } from "../../assets/theme";
import { useNavigation } from "@react-navigation/native";
import EnterOtpCodeModal from "../../components/Modal/EnterOtpCodeModal";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import auth from "@react-native-firebase/auth";

import { login, register } from "../../utils/apiManager";
import { UserContext } from "../../context/UserContext";
import { updateUserFcmToken } from "../../service/userService";
import messaging from "@react-native-firebase/messaging";
import { isPhoneNumber } from "../../utils/stringUtils";
import { NativeEventEmitter } from "react-native";
import { eventNames, handleError } from "../../utils/alertUtils";
import { Box, FormControl, Input, Text, WarningOutlineIcon } from "native-base";
import { EyeIcon, EyeSlashIcon, UserIcon } from "react-native-heroicons/solid";

const RegistrationScreen = () => {
  const navigation = useNavigation();
  const [enterOtpModalVisible, setEnterOtpModalVisible] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState("");

  const [firebaseToken, setFirebaseToken] = useState(null);
  const [firebaseUid, setFirebaseUid] = useState(null);

  const [name, setName] = useState("");
  const { setUser } = useContext(UserContext);

  const eventEmitter = new NativeEventEmitter();

  const [isInputPhoneInvalid, setIsInputPhoneInvalid] = useState(false);
  const handlePhoneChange = (text) => {
    if (!isPhoneNumber(text)) {
      setIsInputPhoneInvalid(true);
    } else {
      setIsInputPhoneInvalid(false);
    }
    setPhoneNumber(text);
    // setIsInputPhoneInvalid(false); // Reset the input validation when the user starts typing again
  };

  const [isInputNameInvalid, setIsInputNameInvalid] = useState(false);
  const [nameInvalidMessage, setNameInvalidMessage] = useState("");

  const handleNameChange = (text) => {
    // setIsInputNameInvalid(false);
    if (text.length == 0) {
      setIsInputNameInvalid(true);
      setNameInvalidMessage("Họ và tên không được bỏ trống!");
    } else if (text.length > 50) {
      setIsInputNameInvalid(true);
      setNameInvalidMessage("Họ và tên không được vượt quá 50 kí tự!");
    } else {
      setIsInputNameInvalid(false);
      // setIsInputPasswordConfirmInvalid(false);
    }
    setFullName(text);
    //  // Reset the input validation when the user starts typing again
  };

  // const [isInputPasswordInvalid, setIsInputPasswordInvalid] = useState(false);
  // const [passwordInvalidMessage, setPasswordInvalidMessage] = useState("");

  // const handlePasswordChange = (text) => {
  //   if (text.length == 0) {
  //     setIsInputPasswordInvalid(true);
  //     setPasswordInvalidMessage("Mật khẩu không được bỏ trống!");
  //   } else if (text.length > 20) {
  //     setIsInputPasswordInvalid(true);
  //     setPasswordInvalidMessage("Mật khẩu không được vượt quá 20 kí tự!");
  //   } else if (text != confirmPassword) {
  //     setIsInputPasswordConfirmInvalid(true);
  //   } else {
  //     setIsInputPasswordConfirmInvalid(false);
  //   }
  //   setPassword(text);
  //   // setIsInputPasswordInvalid(false); // Reset the input validation when the user starts typing again
  // };

  // const [isInputPasswordConfirmInvalid, setIsInputPasswordConfirmInvalid] =
  //   useState(false);
  // const handlePasswordConfirmChange = (text) => {
  //   if (text != password) {
  //     setIsInputPasswordConfirmInvalid(true);
  //   } else {
  //     setIsInputPasswordConfirmInvalid(false);
  //     // setconfirm
  //   }
  //   setConfirmPassword(text);
  // };

  // Handle Login by Firebase
  const onAuthStateChanged = (user) => {
    if (user) {
      user.getIdToken().then((token) => {
        setCode("");
        // setPhoneNumber(user.phoneNumber);
        setFirebaseToken(token);
        setFirebaseUid(user.uid);
        // console.log(user.firebaseUid);
        // console.log(user);
        // console.log(token);
        setEnterOtpModalVisible(false);
      });
    }
  };

  useEffect(() => {
    // console.log(firebaseToken);
    // auth().settings.appVerificationDisabledForTesting = true;
    auth().settings.forceRecaptchaFlowForTesting = true;
    // const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    // return subscriber;
  }, []);

  useEffect(() => {
    if (firebaseToken && firebaseUid) {
      onRegister();
    }
  }, [firebaseToken, firebaseUid]);

  // Handle Send OTP
  const sendOtp = async () => {
    const isValid = isPhoneNumber(phoneNumber);
    if (!isValid) {
      setIsInputPhoneInvalid(true);
    } else {
      setIsLoading(true);

      try {
        // const phone = `+84${phoneNumber.substring(1, 10)}`;
        const confirmation = await auth().signInWithPhoneNumber(
          `+84${phoneNumber.substring(1, 10)}`
        );
        setConfirm(confirmation);
        setEnterOtpModalVisible(true);
        auth().onAuthStateChanged(onAuthStateChanged);
      } catch (err) {
        setIsLoading(false);
        // console.log(err);
        eventEmitter.emit(eventNames.SHOW_TOAST, {
          title: "Gửi mã OTP không thành công",
          description: "Vui lòng kiểm tra lại số điện thoại",
          status: "error",
          // placement: "top-right",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const otpConfirm = async () => {
    setIsLoading(true);
    try {
      const result = await confirm.confirm(code);
      // const credential = auth.PhoneAuthProvider.credential(
      //   confirm.verificationId,
      //   code
      // );
      // const loginInfo = await auth().signInWithCredential(credential);

      // if (loginInfo.user) {
      //   auth().onAuthStateChanged(onAuthStateChanged);
      // }
    } catch (err) {
      setIsLoading(false);
      if (err.code == "auth/invalid-verification-code") {
        handleError(
          "Mã OTP không chính xác",
          "Vui lòng kiểm tra lại mã OTP!",
          navigation
        );
      } else {
        handleError("Có lỗi xảy ra", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const renderAfterOtpConfirm = () => {
  //   if (firebaseToken) {
  //     return (
  //       <View>
  //         <Text>Họ và tên</Text>
  //         <View
  //           style={{
  //             ...vigoStyles.row,
  //             ...{
  //               justifyContent: "center",
  //               marginBottom: 10,
  //             },
  //           }}
  //         >
  //           <TextInput
  //             style={{ ...styles.input, ...{ flex: 1 } }}
  //             onChangeText={setName}
  //             placeholder="Nguyễn Văn A"
  //             autoComplete="name"
  //             keyboardType="default"
  //             textContentType="name"
  //           />
  //         </View>
  //       </View>
  //     );
  //   } else {
  //     return <></>;
  //   }
  // };

  const onRegister = async () => {
    // console.log(fullName.length == 0);
    // if (!isPhoneNumber(phoneNumber)) {
    //   setIsInputPhoneInvalid(true);
    // } else if (fullName.length == 0) {
    //   setIsInputNameInvalid(true);
    //   setNameInvalidMessage("Họ và tên không được bỏ trống!");
    // } else if (fullName.length > 50) {
    //   setIsInputNameInvalid(true);
    //   setNameInvalidMessage("Họ và tên không được vượt quá 50 kí tự!");
    // } else if (password.length == 0) {
    //   setIsInputPasswordInvalid(true);
    //   setPasswordInvalidMessage("Mật khẩu không được bỏ trống!");
    // } else if (password.length > 20) {
    //   setIsInputPasswordInvalid(true);
    //   setPasswordInvalidMessage("Mật khẩu không được vượt quá 20 kí tự!");
    // } else if (password != confirmPassword) {
    //   setIsInputPasswordConfirmInvalid(true);
    // } else {
    setIsLoading(true);
    try {
      // const requestData =
      const newUserData = await register(
        fullName,
        `+84${phoneNumber.substring(1, 10)}`,
        // password
        firebaseUid
      );

      if (newUserData) {
        const eventEmitter = new NativeEventEmitter();
        eventEmitter.emit(eventNames.SHOW_TOAST, {
          title: "Đăng ký tài khoản thành công!",
          description: "Hãy đặt chuyến xe đầu tiên của bạn nhé!",
          status: "success",
          // placement: "top-right",
          isDialog: true,
          onOkPress: async () => {
            const response = await login(
              `+84${phoneNumber.substring(1, 10)}`,
              firebaseToken
            );
            setUser(response.user);
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                {
                  title: "Cho phép ViGo gửi thông báo đến bạn",
                  message: `Nhận thông báo về trạng thái giao dịch, nhắc nhở chuyến đi 
                        trong ngày và hơn thế nữa`,
                  buttonNeutral: "Hỏi lại sau",
                  buttonNegative: "Từ chối",
                  buttonPositive: "Đồng ý",
                }
              );

              console.log(granted);

              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                await messaging().registerDeviceForRemoteMessages();
                const fcmToken = await messaging().getToken();
                await updateUserFcmToken(response.user.id, fcmToken);
              }
            } catch (err) {
              handleError("Có lỗi xảy ra khi đăng ký", err);
            }

            // if (response.user.status == "PENDING") {
            //   navigation.navigate("NewDriverUpdateProfile");
            // } else {
            navigation.navigate("Home");
            // }
          },
        });
      }
      // console.log(newUserData);
    } catch (err) {
      handleError("Có lỗi xảy ra khi đăng ký", err);
    } finally {
      setIsLoading(false);
    }
    // }
  };

  return (
    <View style={{ ...vigoStyles.container, ...styles.container }}>
      <ViGoSpinner isLoading={isLoading} />
      <Image
        source={require("../../assets/images/ViGo_logo.png")}
        style={styles.image}
      />
      <Box alignItems="center">
        <Box
          maxW="80"
          rounded="xl"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="2"
          _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.700",
          }}
          _web={{
            shadow: 8,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: "gray.50",
          }}
        >
          <Box p="4">
            <Text fontSize="3xl" bold>
              Đăng ký
            </Text>
            <Text fontSize="lg">Tham gia hệ thống ViGo ngay hôm nay</Text>
            <Box alignItems="center" pt="4">
              <FormControl
                style={styles.input}
                isInvalid={isInputPhoneInvalid}
                w="95%"
                maxW="500px"
              >
                <Input
                  variant="unstyled"
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  InputLeftElement={
                    <Text fontSize="xs" bold>
                      +84
                    </Text>
                  }
                  placeholder="Nhập số điện thoại"
                />
                {isInputPhoneInvalid && (
                  <FormControl.ErrorMessage
                    // isInvalid={isInputPhoneInvalid}
                    leftIcon={<WarningOutlineIcon size="xs" />}
                    pb="2"
                  >
                    Số điện thoại không hợp lệ
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
            </Box>

            <Box alignItems="center" pt="1">
              <FormControl
                style={styles.input}
                isInvalid={isInputNameInvalid}
                w="95%"
                maxW="500px"
              >
                <Input
                  variant="unstyled"
                  placeholder="Nhập họ và tên"
                  value={fullName}
                  autoComplete="name"
                  keyboardType="default"
                  textContentType="name"
                  onChangeText={handleNameChange}
                  // variant={"filled"}
                  // style={{ backgroundColor: "white" }}
                  // style={styles.input}
                  InputLeftElement={<UserIcon size={18} color="black" />}
                />
                <FormControl.ErrorMessage
                  // isInvalid={isInputPhoneInvalid}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                  pb="2"
                >
                  {nameInvalidMessage}
                </FormControl.ErrorMessage>
              </FormControl>
            </Box>
            {/* <Box alignItems="center" pt="1">
              <FormControl
                style={styles.input}
                isInvalid={isInputPasswordInvalid}
                w="95%"
                maxW="500px"
              >
                <Input
                  variant="unstyled"
                  value={password}
                  onChangeText={handlePasswordChange}
                  // keyboardType="numeric"
                  type={showPassword ? "text" : "password"}
                  InputLeftElement={
                    <TouchableOpacity
                      p="3"
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {!showPassword ? (
                        <EyeIcon size={18} color="black" />
                      ) : (
                        <EyeSlashIcon name="eye-off" size={18} color="black" />
                      )}
                    </TouchableOpacity>
                  }
                  placeholder="Mật khẩu"
                />
                <FormControl.ErrorMessage
                  // isInvalid={isInputPasswordInvalid}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                  pb="2"
                >
                  {passwordInvalidMessage}
                </FormControl.ErrorMessage>
              </FormControl>
            </Box>
            <Box alignItems="center" pt="1">
              <FormControl
                style={styles.input}
                isInvalid={isInputPasswordConfirmInvalid}
                w="95%"
                maxW="500px"
              >
                <Input
                  variant="unstyled"
                  value={confirmPassword}
                  onChangeText={handlePasswordConfirmChange}
                  // keyboardType=""
                  type={showConfirmPassword ? "text" : "password"}
                  InputLeftElement={
                    <TouchableOpacity
                      p="3"
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {!showConfirmPassword ? (
                        <EyeIcon size={18} color="black" />
                      ) : (
                        <EyeSlashIcon name="eye-off" size={18} color="black" />
                      )}
                    </TouchableOpacity>
                  }
                  placeholder="Xác nhận mật khẩu"
                />
                <FormControl.ErrorMessage
                  // isInvalid={isInputPasswordConfirmInvalid}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                  pb="2"
                >
                  Mật khẩu không trùng khớp!
                </FormControl.ErrorMessage>
              </FormControl>
            </Box> */}
            <Box pt="1" mt="1">
              <TouchableOpacity
                style={vigoStyles.buttonPrimary}
                onPress={() => sendOtp()}
                disabled={
                  isInputPhoneInvalid /*||
                  isInputPasswordInvalid ||
                  isInputPasswordConfirmInvalid*/
                }
              >
                <Text style={vigoStyles.buttonPrimaryText}>Tiếp tục</Text>
              </TouchableOpacity>
            </Box>

            <View
              style={{ ...vigoStyles.row, ...{ justifyContent: "flex-start" } }}
            >
              <Text style={styles.loginText}>Bạn đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={vigoStyles.link}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </Box>
        </Box>
      </Box>

      <EnterOtpCodeModal
        modalVisible={enterOtpModalVisible}
        setModalVisible={setEnterOtpModalVisible}
        onModalRequestClose={() => {}}
        onModalConfirm={() => otpConfirm()}
        phoneNumber={`+84${phoneNumber.substring(1, 10)}`}
        // phoneNumber={`+84${phoneNumber}`}
        setCode={setCode}
      />
    </View>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.linear,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 80,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    marginTop: 40,
    marginBottom: 30,
  },
  input: {
    // height: 50,
    borderRadius: 10,
    paddingHorizontal: 20,
    // marginBottom: 10,
    backgroundColor: themeColors.linear,
  },
  loginText: {
    fontSize: 16,
  },
});

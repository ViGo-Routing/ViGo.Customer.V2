import { React, useState, useRef, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  NativeEventEmitter,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// IMPORT THEME
import { themeColors, vigoStyles } from "../../assets/theme";
import { login } from "../../utils/apiManager";
import SignalRService from "../../utils/signalRUtils";
// IMPORT FIREBASE
// import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
// import { firebaseConfig } from "../../config/firebase";
// import firebase from "firebase/compat/app";
import { UserContext } from "../../context/UserContext";
import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid } from "react-native";
import { updateUserFcmToken } from "../../service/userService";
import auth from "@react-native-firebase/auth";
import {
  Box,
  FormControl,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Pressable,
  Stack,
  WarningOutlineIcon,
  MaterialIcons,
  AntDesign,
  Text,
  IconButton,
  HStack,
  Spinner,
  Heading,
} from "native-base";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/solid";
import { isPhoneNumber } from "../../utils/stringUtils";
import { eventNames, handleError } from "../../utils/alertUtils";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import EnterOtpCodeModal from "../../components/Modal/EnterOtpCodeModal";
import { Platform } from "react-native";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);
  const [enterOtpModalVisible, setEnterOtpModalVisible] = useState(false);

  // const recaptchaVerifier = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [firebaseToken, setFirebaseToken] = useState(null);
  // const recaptchaVerifier = useRef(null);
  const [show, setShow] = useState(false);
  const eventEmitter = new NativeEventEmitter();
  const [code, setCode] = useState("");

  // Handle Login by Firebase
  const onAuthStateChanged = (user) => {
    if (user) {
      user.getIdToken().then((token) => {
        setCode("");
        // setPhoneNumber(user.phoneNumber);
        setFirebaseToken(token);
        // setFirebaseUid(user.uid);
        // console.log(user.firebaseUid);
        // console.log(user);
        // console.log(token);
        setEnterOtpModalVisible(false);
      });
    }
  };

  useEffect(() => {
    // getString("token").then((result) => console.log(result));
    // console.log(firebaseToken);
    auth().settings.forceRecaptchaFlowForTesting = true;
    // auth().settings.forceRecaptchaFlowForTesting = true;
    // const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    // return subscriber;
    // if (user) {
    //   navigation.navigate("Home");
    // }

    // const authUnsubscriber = auth().onAuthStateChanged(onAuthStateChanged);

    // return () => {
    //   authUnsubscriber();
    //   // unsubscribe();
    // };
  }, []);

  const handleLogin = async () => {
    // console.log(firebaseToken);
    // const isValid = isPhoneNumber(phoneNumber);
    // if (!isValid || (phoneNumber == "" && password == "")) {
    //   if (password == "") {
    //     setIsInputPasswordInvalid(true);
    //   }
    //   setIsInputPhoneInvalid(true);
    // } else {
    setIsLoading(true);
    const phone = `+84${phoneNumber.substring(1, 10)}`;
    // console.log(phone);
    try {
      const response = await login(phone, firebaseToken);
      setUser(response.user);
      // console.log("Token " + (await getString("token")));
      SignalRService.updateToken(response.token);

      const permissions = [
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ];

      const results = await PermissionsAndroid.requestMultiple(
        permissions /*,
              {
                title: "Cho phép ViGo gửi thông báo đến bạn",
                message: `Nhận thông báo về trạng thái giao dịch, nhắc nhở chuyến đi 
            trong ngày và hơn thế nữa`,
                buttonNeutral: "Hỏi lại sau",
                buttonNegative: "Từ chối",
                buttonPositive: "Đồng ý",
              }*/
      );
      // setIsLoading(false);
      if (
        (Platform.constants["Version"] < 33 ||
          results[PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS] ===
            PermissionsAndroid.RESULTS.GRANTED) &&
        results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        await messaging().registerDeviceForRemoteMessages();
        const fcmToken = await messaging().getToken();
        await updateUserFcmToken(response.user.id, fcmToken);
      } else {
        console.log("Some permissions denied");
      }

      eventEmitter.emit(eventNames.SHOW_TOAST, {
        title: "Đăng nhập thành công",
        description: "",
        status: "success",
        placement: "top",
        duration: 3000,
        isSlide: true,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (err) {
      setIsLoading(false);
      // console.error(err.response.status);
      // const eventEmitter = new NativeEventEmitter();
      if (err.response && err.response.status != 401) {
        eventEmitter.emit(eventNames.SHOW_TOAST, {
          // title: "Đăng nhập không thành công",
          description: err.response.data,
          status: "error",
          // placement: "top-right",
          isDialog: true,
        });
      } else {
        // console.log(err);
        eventEmitter.emit(eventNames.SHOW_TOAST, {
          title: "Đăng nhập không thành công",
          description: "Vui lòng kiểm tra lại thông tin đăng nhập",
          status: "error",
          // placement: "top-right",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (firebaseToken) {
      handleLogin();
    }
  }, [firebaseToken]);

  const sendVerification = async () => {
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

  const confirmCode = async () => {
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
        handleError("Có lỗi xảy ra", err, navigation);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const [inputValue, setInputValue] = useState("");
  const [isInputPhoneInvalid, setIsInputPhoneInvalid] = useState(false);
  // const [isInputPasswordInvalid, setIsInputPasswordInvalid] = useState(false);
  const handlePhoneChange = (text) => {
    setPhoneNumber(text);
    setIsInputPhoneInvalid(false); // Reset the input validation when the user starts typing again
  };
  // const handlePasswordChange = (text) => {
  //   setPassword(text);
  //   setIsInputPasswordInvalid(false); // Reset the input validation when the user starts typing again
  // };

  const handleSubmit = () => {
    // Handle the form submission here with the valid input value
    console.log("Valid input:", inputValue);
  };

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
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
              Đăng nhập
            </Text>
            <Text fontSize="xl">Chào mừng bạn đến ViGo</Text>
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
                    leftIcon={<WarningOutlineIcon size="xs" />}
                    pb="2"
                  >
                    Số điện thoại không hợp lệ
                  </FormControl.ErrorMessage>
                )}
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
                  keyboardType="default"
                  type={show ? "text" : "password"}
                  InputLeftElement={
                    <TouchableOpacity p="3" onPress={() => setShow(!show)}>
                      {!show ? (
                        <EyeIcon size={18} color="black" />
                      ) : (
                        <EyeSlashIcon name="eye-off" size={18} color="black" />
                      )}
                    </TouchableOpacity>
                  }
                  placeholder="Mật khẩu"
                />
                {isInputPasswordInvalid && (
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                    pb="2"
                  >
                    Bạn chưa nhập mật khẩu
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
            </Box> */}

            <TouchableOpacity style={styles.button} onPress={sendVerification}>
              <Text style={styles.buttonText}>Tiếp tục</Text>
            </TouchableOpacity>
            <Text style={styles.link}>Quên mật khẩu?</Text>

            <HStack>
              <Text style={styles.registerText}>Bạn chưa có tài khoản? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Registration")}
              >
                <Text style={styles.link}>Đăng ký</Text>
              </TouchableOpacity>
            </HStack>
          </Box>
        </Box>
      </Box>

      <EnterOtpCodeModal
        phoneNumber={`+84${phoneNumber.substring(1, 10)}`}
        setModalVisible={setEnterOtpModalVisible}
        modalVisible={enterOtpModalVisible}
        onModalConfirm={() => confirmCode()}
        onModalRequestClose={() => {}}
        setCode={setCode}
      />
    </View>
  );
}

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
  title: {
    textAlign: "left",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
  },
  smallText: {
    fontSize: 20,
    paddingBottom: 15,
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 20,
    // marginBottom: 10,
    backgroundColor: themeColors.linear,
  },
  button: {
    backgroundColor: themeColors.primary,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 20,
    marginBottom: 20,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  registerText: {
    fontSize: 16,
  },
  link: {
    // textAlign:'center',
    color: themeColors.primary,
    fontSize: 16,
    // textDecorationLine: 'underline',
  },
});

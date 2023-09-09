import { React, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

//IMPORT THEME
import { themeColors } from "../../assets/theme";
// IMPORT FIREBASE
// import firebase from "firebase/compat/app";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

//IMPORT COMPONENTS

export default function ConfirmCodeScreen({ route }) {
  const [code, setCode] = useState("");
  const { verificationId } = route.params;
  const confirmCode = () => {
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(() => {
        setCode("");
        Alert.alert(
          "Đăng nhập thành công! Hãy đặt chuyến xe đầu tiên của bạn nào",
          "",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("Home");
              },
            },
          ]
        );
      })
      .catch((error) => {
        //show an alert in case of error
        alert(error);
      });
  };

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* <Ionicons name="arrow-back" size={30} color={themeColors.primary} /> */}
          <ArrowLeftIcon size={30} color={themeColors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <Image
          source={require("../../assets/images/ViGo_logo.png")}
          style={styles.image}
        />
        <View style={styles.card}>
          <Text style={styles.title}>OTP</Text>
          <Text style={styles.smallText}>Xác minh tài khoản</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            onChangeText={setCode}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.button} onPress={confirmCode}>
            <Text style={styles.buttonText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingLeft: 25,
    paddingRight: "85%",
    paddingBottom: "20%",
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    backgroundColor: themeColors.linear,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    marginTop: -60,
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
    alignSelf: "center",
  },
  title: {
    textAlign: "left",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
  },
  smallText: {
    fontSize: 18,
    paddingBottom: 15,
  },
  input: {
    height: 50,
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: themeColors.linear,
  },
  button: {
    backgroundColor: themeColors.primary,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  registerText: {
    fontSize: 16,
  },
  registerLink: {
    color: themeColors.primary,
    fontSize: 16,
    // textDecorationLine: 'underline',
  },
});

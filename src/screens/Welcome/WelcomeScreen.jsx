import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { themeColors } from "../../assets/theme";
import CustomButton from "../../components/Button/CustomButton";

const WelcomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Xin chào
        {"\n"}
        chúng tôi là
      </Text>
      <Image
        source={require("../../assets/images/ViGo_logo.png")}
        style={styles.image}
      />
      <View style={styles.buttonContainer}>
        <CustomButton
          style={styles.btn}
          title="Tiếp tục"
          onPress={() => navigation.navigate("Login")}
        />
      </View>
      {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: themeColors.linear,
  },
  title: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: "bold",
    color: themeColors.primary,
  },
  buttonContainer: {
    width: "90%",
  },
});

export default WelcomeScreen;

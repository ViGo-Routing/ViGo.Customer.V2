import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// IMPORT COMPONENTS
import Header from "../../components/Header/Header";
import CustomButton from "../../components/Button/CustomButton";
import Profile from "../../components/Profile/Profile";
import { useNavigation } from "@react-navigation/native";
import { themeColors } from "../../assets/theme/index";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="Chỉnh sửa hồ sơ" />
      </View>
      <View style={styles.body}>
        <Profile />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("BookingDetail")}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Cập nhật</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
  body: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: "white",
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 225,
  },
  footer: {
    padding: 10,
  },
  button: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: themeColors.primary,
    alignItems: "center",
  },
});

export default EditProfileScreen;

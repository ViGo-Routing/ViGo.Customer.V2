import React, { memo, useContext } from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { themeColors } from "../../assets/theme";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../../context/UserContext";

const HomeHeader = () => {
  const navigation = useNavigation();

  const { user } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchbar}
        placeholder=" 🔍 Tìm dịch vụ, món ngon, địa điểm"
      />
      <TouchableOpacity
        onPress={() => navigation.navigate("ProfileTab", { screen: "Home" })}
      >
        <Image
          source={
            user?.avatarUrl
              ? { uri: user.avatarUrl }
              : require("../../assets/images/no-image.jpg")
          }
          style={styles.profile}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // justifyContent: 'center',
    alignItems: "center",
    paddingRight: 16,
    // paddingTop: 20,
    height: 80,
    backgroundColor: themeColors.primary,
    // borderBottomLeftRadius:16,
    // borderBottomRightRadius:16,
  },
  searchbar: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: themeColors.linear,
  },
});

export default memo(HomeHeader);

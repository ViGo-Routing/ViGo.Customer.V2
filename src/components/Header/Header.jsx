import React, { memo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { themeColors } from "../../assets/theme";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
} from "react-native-heroicons/solid";
import { Box, HStack, Text } from "native-base";

const Header = ({
  title,
  isBackButtonShown = true,
  onBackButtonPress = undefined,
  backButtonDirection = "left",
}) => {
  const navigation = useNavigation();
  const onBackPress = () => {
    navigation.goBack();
  };

  if (onBackButtonPress === undefined) {
    onBackButtonPress = onBackPress;
  }

  const renderBackButton = () => {
    switch (backButtonDirection) {
      case "down":
        return <ChevronDownIcon size={25} color="white" />;
      case "left":
      default:
        return <ChevronLeftIcon size={25} color="white" />;
    }
  };

  return (
    // <View style={styles.container}>
    //   <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
    //     {/* <Ionicons name="arrow-back" size={30} color="white" /> */}
    //     <ArrowLeftIcon size={30} color="white" />
    //   </TouchableOpacity>
    //   <Text style={styles.title}>{title}</Text>
    // </View>
    <Box
      backgroundColor={themeColors.primary}
      style={{ height: 55 }}
      justifyContent={"center"}
    >
      <HStack
        alignItems={"center"}
        paddingLeft={isBackButtonShown ? 3 : 0}
        justifyContent={isBackButtonShown ? "flex-start" : "center"}
      >
        {isBackButtonShown && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackButtonPress}
          >
            {renderBackButton()}
          </TouchableOpacity>
        )}
        <Text
          marginLeft={isBackButtonShown ? 3 : 0}
          bold
          fontSize={"2xl"}
          color={"white"}
        >
          {title}
        </Text>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 0,
    height: 40,
    backgroundColor: themeColors.primary,
    // borderBottomLeftRadius:16,
    // borderBottomRightRadius:16,
  },
  backButton: {
    // paddingTop: 10,
    // position: "absolute",
    // left: 20,
  },
  // title: {
  //   fontSize: 25,
  //   color: "white",
  //   fontWeight: "bold",
  // },
});

export default memo(Header);

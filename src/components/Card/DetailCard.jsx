import { HStack, Text } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";

const DetailCard = ({ title, info }) => {
  return (
    // <View style={styles.container}>
    //   <Text style={styles.title}>{title}</Text>
    //   <Text style={styles.info}>{info}</Text>
    // </View>
    <HStack justifyContent="space-between" p="1" py="1.5">
      <Text style={styles.title}>{title}</Text>
      <Text maxW="60%" style={styles.info}>
        {info}
      </Text>
    </HStack>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  title: {
    fontWeight: "bold",
  },
  info: {
    textAlign: "right",
  },
});

export default DetailCard;

import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Header from "../../components/Header/Header";
import BottomNavigationBar from "../../components/NavBar/BottomNavigationBar";

const MessageScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        <Header title="Hộp thư" />
      </View>
      <View style={styles.body}>
        <Text>MessageScreen</Text>
      </View>
      <View style={styles.footer}>
        <BottomNavigationBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column", // inner items will be added vertically
    flexGrow: 1, // all the available vertical space will be occupied by it
    justifyContent: "space-between", // will create the gutter between body and footer
  },
  body: {
    flex: 1,
  },
});

export default MessageScreen;

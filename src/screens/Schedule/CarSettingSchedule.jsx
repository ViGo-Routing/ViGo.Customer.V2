import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Header from "../../components/Header/Header";
import CalendarCard from "../../components/Calender/CalenderCard";
import { themeColors } from "../../assets/theme/index";
import InputCard from "../../components/Card/InputCard";
import TimeCard from "../../components/Card/TimeCard";

const CarSettingSchedule = () => {
  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        <Header title="Đặt lịch" />
      </View>
      <View style={styles.body}>
        <View style={styles.card}>
          <InputCard />
        </View>
        <View style={styles.calen}>
          <CalendarCard />
        </View>
      </View>
      <TimeCard title="Select Time" />
      <View style={styles.footer}></View>
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
    backgroundColor: themeColors.linear,
  },
  calen: {
    padding: 20,
  },
  card: {
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
  },
});

export default CarSettingSchedule;

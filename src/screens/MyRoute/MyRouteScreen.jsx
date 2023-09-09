import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Header from "../../components/Header/Header.jsx";
import BottomNavigationBar from "../../components/NavBar/BottomNavigationBar.jsx";
import { themeColors } from "../../assets/theme/index.jsx";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeScreen from "../Home/HomeScreen.jsx";
import HistoryScreen from "../History/HistoryScreen.jsx";
import OnGoingScreen from "../History/OnGoingScreen.jsx";
import PendingScreen from "../History/PendingScreen.jsx";
import CancelScreen from "../History/CancelScreen.jsx";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner.jsx";
const MyRouteScreen = () => {
  const [selectedTab, setSelectedTab] = useState("Hành trình");
  const [isGoingLoading, setIsGoingLoading] = useState(false);
  const [isPendingLoading, setIsPendingLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);

  const Tab = createMaterialTopTabNavigator();

  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        <Header title="Hành trình" />
      </View>
      {/* <ViGoSpinner
        isLoading={
          isGoingLoading ||
          isPendingLoading ||
          isHistoryLoading ||
          isCancelLoading
        }
      /> */}
      <View style={styles.body}>
        <Tab.Navigator>
          <Tab.Screen
            name="Đang đi"
            children={({ navigation }) => (
              <OnGoingScreen
                navigation={navigation}
                setIsLoading={setIsGoingLoading}
                isLoading={isGoingLoading}
              />
            )}
          />
          <Tab.Screen
            name="Đang đợi"
            children={({ navigation }) => (
              <PendingScreen
                navigation={navigation}
                setIsLoading={setIsPendingLoading}
                isLoading={isPendingLoading}
              />
            )}
          />
          <Tab.Screen
            name="Lịch sử"
            children={({ navigation }) => (
              <HistoryScreen
                navigation={navigation}
                setIsLoading={setIsHistoryLoading}
                isLoading={isHistoryLoading}
              />
            )}
          />
          <Tab.Screen
            name="Đã hủy"
            children={({ navigation }) => (
              <CancelScreen
                navigation={navigation}
                setIsLoading={setIsCancelLoading}
                isLoading={isCancelLoading}
              />
            )}
          />
        </Tab.Navigator>
        {/* <View style={styles.tabContainer}>
          {['Đang đi', 'Đang đợi', 'Lịch sử', 'Đặt trước'].map(tab => (
            <Text
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.selectedTab]}
              onPress={() => setSelectedTab(tab)}>
              {tab}
            </Text>
          ))}
        </View> */}
      </View>
      <View style={styles.footer}>
        <BottomNavigationBar />
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
    flex: 1,
    backgroundColor: themeColors.linear,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: themeColors.linear,
  },
  tab: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999",
  },
  selectedTab: {
    color: themeColors.primary,
  },
});

export default MyRouteScreen;

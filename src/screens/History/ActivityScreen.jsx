import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Header from "../../components/Header/Header";
import { themeColors } from "../../assets/theme/index";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HistoryScreen from "../History/HistoryScreen";
import OnGoingScreen from "../History/OnGoingScreen";
import PendingScreen from "../History/PendingScreen";
import CancelScreen from "../History/CancelScreen";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import HistoryCompleteScreen from "./HistoryCompleteScreen";
import HistoryCancelScreen from "./HistoryCancelScreen";
const ActivityScreen = () => {
    const [selectedTab, setSelectedTab] = useState("Hành trình");
    const [isGoingLoading, setIsGoingLoading] = useState(false);
    const [isPendingLoading, setIsPendingLoading] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [isCancelLoading, setIsCancelLoading] = useState(false);

    const Tab = createMaterialTopTabNavigator();

    return (
        <View style={styles.container}>
            {/* <View style={styles.footer}> */}
            <Header isBackButtonShown={false} title="Hoạt động" />
            {/* </View> */}
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
                        name="Đã đi"
                        children={({ navigation }) => (
                            <HistoryCompleteScreen
                                navigation={navigation}
                                setIsLoading={setIsHistoryLoading}
                                isLoading={isHistoryLoading}
                            />
                        )}
                    />
                    <Tab.Screen
                        name="Đã hủy"
                        children={({ navigation }) => (
                            <HistoryCancelScreen
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

export default ActivityScreen;

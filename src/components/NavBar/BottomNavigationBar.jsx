import React, { memo } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { themeColors } from "../../assets/theme";
import {
  BanknotesIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
  MapIcon,
  UserIcon,
} from "react-native-heroicons/solid";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MyRouteScreen from "../../screens/MyRoute/MyRouteScreen";
import HomeComponent from "../../screens/Home/HomeComponent";
import ProfileSreen from "../../screens/Profile/ProfileScreen";
import { Box } from "native-base";

const Tab = createBottomTabNavigator();

const BottomNavigationBar = () => {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      // tabBar={(props) => renderTabBar(props)}
      // sceneContainerStyle={{ backgroundColor: themeColors.primary }}
      screenOptions={{
        lazy: true,
        tabBarStyle: {
          backgroundColor: themeColors.primary,
          paddingBottom: 5,
          paddingTop: 5,
          height: 55,
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#b1d1d1",
      }}
    >
      <Tab.Screen
        name="HomeTab"
        key="HomeTab"
        component={HomeComponent}
        options={{
          tabBarLabel: "TRANG CHỦ",
          tabBarIcon: ({ focused, color, size }) => (
            <HomeIcon size={size} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="ScheduleTab"
        key="ScheduleTab"
        component={MyRouteScreen}
        options={{
          tabBarLabel: "LỊCH TRÌNH",
          tabBarIcon: ({ focused, color, size }) => (
            <MapIcon size={size} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        key="ProfileTab"
        component={ProfileSreen}
        options={{
          tabBarLabel: "CÁ NHÂN",
          tabBarIcon: ({ focused, color, size }) => (
            <UserIcon size={size} color={color} />
          ),
          tabBarBackground: () => <Box backgroundColor={themeColors.primary} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
    // </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    backgroundColor: themeColors.primary,
  },
});

export default memo(BottomNavigationBar);

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// IMPORT SCREENS
import HomeScreen from "../screens/Home/HomeScreen";
import WelcomeScreen from "../screens/Welcome/WelcomeScreen";
import LoginScreen from "../screens/Login/LoginScreen";
import MenuSettingScreen from "../screens/MenuSetting/MenuSettingScreen";
import MessageScreen from "../screens/Message/MessageScreen";
import PromotionScreen from "../screens/Promotion/PromotionScreen";
import HistoryScreen from "../screens/History/HistoryScreen";
import MyRouteScreen from "../screens/MyRoute/MyRouteScreen";
import ProfileSreen from "../screens/Profile/ProfileScreen";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import BikeBookingScreen from "../screens/Booking/BikeBookingScreen";
import CarBookingScreen from "../screens/Booking/CarBookingScreen";
import BikeSettingSchedule from "../screens/Schedule/BikeSettingSchedule";
import CarSettingSchedule from "../screens/Schedule/CarSettingSchedule";
import BookingDetailScreen from "../screens/Booking/BookingDetailScreen";
import SelectRouteScreen from "../screens/Booking/SelectRouteScreen";
import { UserProvider } from "../context/UserContext";
import RoutineGenerator from "../screens/Booking/RoutineGeneratorScreen";
import WalletScreen from "../screens/Wallet/WalletScreen";
import WalletTransactionDetailScreen from "../screens/Wallet/WalletTransactionDetailScreen";
import TopupScreen from "../screens/Wallet/Topup/TopupScreen";
import { useNotificationHook } from "../hooks/useNotificationHook";
import { useOnNotificationClickHook } from "../hooks/useOnNotificationClickHook";
import WalletTransactionsScreen from "../screens/Wallet/WalletTransactionsScreen";
import FeedbackScreen from "../screens/Feedback/FeedbackScreen";
import { DetailBookingDetailScreen } from "../screens/Booking/DetailBookingDetailScreen";
import TrackingLocationScreen from "../screens/TrackingLocation/TrackingLocation";
import MyNotifcationScreen from "../screens/Notification/MyNotificationScreen";
import RegistrationScreen from "../screens/Registration/RegistrationScreen";
import { DetailBookingScreen } from "../screens/Booking/DetailBooking";
import UpdateBookingScreen from "../screens/Booking/UpdateBooking";
import UpdateRouteAndRoutineScreen from "../screens/Route/UpdateRouteAndRoutine";
import ViGoSpinner from "../components/Spinner/ViGoSpinner";
import MyReportScreen from "../screens/Report/MyReportScreen";
import ReportDetailScreen from "../screens/Report/ReportDetailScreen";
// import TopupAmountScreen from "../screens/Wallet/Topup/TopupAmountModal";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const [isLoading, setIsLoading] = React.useState(false);
  useNotificationHook();

  const { initialScreen, initialParams } =
    useOnNotificationClickHook(setIsLoading);

  return (
    <>
      <ViGoSpinner isLoading={isLoading} key="spinner-navigation" />

      <Stack.Navigator
        initialRouteName={initialScreen}
        screenOptions={{
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={HomeScreen}
        />
        <Stack.Screen
          name="Welcome"
          options={{ headerShown: false }}
          component={WelcomeScreen}
        />

        <Stack.Screen
          name="Registration"
          options={{ headerShown: false }}
          component={RegistrationScreen}
        />
        <Stack.Screen
          name="MenuSetting"
          options={{ headerShown: false }}
          component={MenuSettingScreen}
        />
        <Stack.Screen
          name="Message"
          options={{ headerShown: false }}
          component={MessageScreen}
        />
        <Stack.Screen
          name="Promotion"
          options={{ headerShown: false }}
          component={PromotionScreen}
        />
        <Stack.Screen
          name="History"
          options={{ headerShown: false }}
          component={HistoryScreen}
        />
        <Stack.Screen
          name="MyRoute"
          options={{ headerShown: false }}
          component={MyRouteScreen}
        />
        <Stack.Screen
          name="Profile"
          options={{ headerShown: false }}
          component={ProfileSreen}
        />
        <Stack.Screen
          name="EditProfile"
          options={{ headerShown: false }}
          component={EditProfileScreen}
        />
        <Stack.Screen
          name="BikeBooking"
          options={{ headerShown: false }}
          component={BikeBookingScreen}
        />
        <Stack.Screen
          name="CarBooking"
          options={{ headerShown: false }}
          component={CarBookingScreen}
        />
        <Stack.Screen
          name="BikeSettingSchedule"
          options={{ headerShown: false }}
          component={BikeSettingSchedule}
        />
        <Stack.Screen
          name="CarSettingSchedule"
          options={{ headerShown: false }}
          component={CarSettingSchedule}
        />
        <Stack.Screen
          name="BookingDetail"
          options={{ headerShown: false }}
          component={BookingDetailScreen}
        />
        <Stack.Screen
          name="SelectRoute"
          options={{ headerShown: false }}
          component={SelectRouteScreen}
        />
        <Stack.Screen
          name="RoutineGenerator"
          options={{ headerShown: false }}
          component={RoutineGenerator}
        />
        <Stack.Screen
          name="Wallet"
          options={{ headerShown: false }}
          component={WalletScreen}
        />
        <Stack.Screen
          name="WalletTransactionDetail"
          options={{ headerShown: false }}
          component={WalletTransactionDetailScreen}
          initialParams={
            initialScreen == "WalletTransactionDetail"
              ? initialParams
              : undefined
          }
        />
        <Stack.Screen
          name="Topup"
          options={{ headerShown: false }}
          component={TopupScreen}
        />
        {/* <Stack.Screen
            name="TopupAmount"
            options={{ headerShown: false }}
            component={TopupAmountScreen}
          /> */}
        <Stack.Screen
          name="WalletTransactions"
          options={{ headerShown: false }}
          component={WalletTransactionsScreen}
        />
        <Stack.Screen
          name="Feedback"
          options={{ headerShown: false }}
          component={FeedbackScreen}
        />
        <Stack.Screen
          name="DetailBookingDetail"
          options={{ headerShown: false }}
          component={DetailBookingDetailScreen}
        />
        <Stack.Screen
          name="DetailBooking"
          options={{ headerShown: false }}
          component={DetailBookingScreen}
        />
        <Stack.Screen
          name="TrackingLocation"
          options={{ headerShown: false }}
          component={TrackingLocationScreen}
        />
        <Stack.Screen
          name="MyNotification"
          options={{ headerShown: false }}
          component={MyNotifcationScreen}
        />
        <Stack.Screen
          name="UpdateBooking"
          options={{ headerShown: false }}
          component={UpdateBookingScreen}
        />
        <Stack.Screen
          name="UpdateRouteAndRoutine"
          options={{ headerShown: false }}
          component={UpdateRouteAndRoutineScreen}
        />

        <Stack.Screen
          name="MyReport"
          options={{ headerShown: false }}
          component={MyReportScreen}
        />
        <Stack.Screen
          name="ReportDetail"
          options={{ headerShown: false }}
          component={ReportDetailScreen}
        />
      </Stack.Navigator>
    </>
  );
}

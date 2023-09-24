import { NavigationContainer } from "@react-navigation/native";
import { UserProvider } from "./src/context/UserContext";
import AppNavigation from "./src/navigation/AppNavigation";
import { NativeBaseProvider, Text, Box } from "native-base";
import ViGoAlertProvider from "./src/components/Alert/ViGoAlertProvider";
import PushNotification from "react-native-push-notification";

navigator.geolocation = require("react-native-geolocation-service");

export default function App() {
  PushNotification.createChannel(
    {
      channelId: "vigo-customer-channel",
      channelName: "ViGo - Customer - Notifcation Channel",
      channelDescription: "ViGo - Customer - Notifcation Channel",
    },
    (created: any) => console.log("Channel created!")
  );

  return (
    <UserProvider>
      <NavigationContainer>
        <NativeBaseProvider>
          <ViGoAlertProvider />
          <AppNavigation />
        </NativeBaseProvider>
      </NavigationContainer>
    </UserProvider>
  );
}

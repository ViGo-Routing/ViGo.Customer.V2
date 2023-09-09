import { NavigationContainer } from "@react-navigation/native";
import { UserProvider } from "./src/context/UserContext";
import AppNavigation from "./src/navigation/AppNavigation";
import { NativeBaseProvider, Text, Box } from "native-base";
import ViGoAlertProvider from "./src/components/Alert/ViGoAlertProvider";

export default function App() {
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

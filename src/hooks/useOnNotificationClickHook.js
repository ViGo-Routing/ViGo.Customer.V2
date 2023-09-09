import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import messaging from "@react-native-firebase/messaging";
import { paymentNotificationOnClickHandlers } from "../utils/notificationUtils/paymentNotificationHandlers";
import { UserContext } from "../context/UserContext";

export const useOnNotificationClickHook = () => {
  const navigation = useNavigation();

  const { setUser } = useContext(UserContext);

  const [initialScreen, setInitialScreen] = useState("Login");
  const [initialParams, setInitialParams] = useState(undefined);

  useEffect(() => {
    // App is opened from background state
    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage.data.action == "payment") {
        paymentNotificationOnClickHandlers(remoteMessage.data, navigation);
      }
    });

    // App is opened from a quit state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          setInitialScreen("WalletTransactionDetail");
          setInitialParams({ walletTransactionId: data.walletTransactionId });
        }
      });
  }, []);

  return { initialScreen, initialParams };
};

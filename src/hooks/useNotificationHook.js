import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { paymentNotificationHandlers } from "../utils/notificationUtils/paymentNotificationHandlers";
import { useNavigation } from "@react-navigation/native";
import PushNotification from "react-native-push-notification";

export const useNotificationHook = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // console.log(remoteMessage);
      if (remoteMessage.notification) {
        // console.log("Notification");
        PushNotification.localNotification({
          channelId: "vigo-customer-channel",
          message: remoteMessage.notification.body,
          title: remoteMessage.notification.title,
          smallIcon: "vigo_customer_logo.png",
        });
      }

      if (remoteMessage.data.action == "payment") {
        // paymentNotificationHandlers(remoteMessage.data, navigation);
      } else if (remoteMessage.data.action == "login") {
        // console.log("Recieved Message for login navigation");
        // setUser(null, (s) => {
        //   navigation.navigate("Login");
        //   console.log("Navigate to login");
        // });
        // ;
        navigation.navigate("Login");
      }
    });

    return unsubscribe;
  }, []);
};

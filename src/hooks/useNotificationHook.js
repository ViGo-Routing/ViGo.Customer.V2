import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { paymentNotificationHandlers } from "../utils/notificationUtils/paymentNotificationHandlers";
import { useNavigation } from "@react-navigation/native";
import PushNotification from "react-native-push-notification";
import { trackingNotificationHandlers, trackingOnGoingNotificationHandlers } from "../utils/notificationUtils/trackingNotificationHandlers";
import { feedbackNotificationHandlers } from "../utils/notificationUtils/completeTripNotificationHandlers";

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
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.data.action == "bookingDetail") {
        if (remoteMessage.data.status == "ARRIVE_AT_DROPOFF") {
          feedbackNotificationHandlers(remoteMessage.data.bookingDetailId, navigation);
        } else if (remoteMessage.data.status == "GOING_TO_PICKUP") {
          trackingNotificationHandlers(remoteMessage.data.bookingDetailId, navigation);
        } else if (remoteMessage.data.status == "GOING_TO_DROPOFF") {
          trackingOnGoingNotificationHandlers(remoteMessage.data.bookingDetailId, navigation);
        }
      } else if (remoteMessage.data.action == "login") {
        setUser(null);
        // await setUserData(null);
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    });

    return unsubscribe;
  }, []);
};

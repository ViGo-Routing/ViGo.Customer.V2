import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import messaging from "@react-native-firebase/messaging";
import { paymentNotificationOnClickHandlers } from "../utils/notificationUtils/paymentNotificationHandlers";
import { UserContext } from "../context/UserContext";
import SignalR from "../utils/signalRUtils";
import { getUserIdViaToken, isValidToken } from "../utils/tokenUtils";
import { getProfile } from "../service/userService";
import { getString } from "../utils/storageUtils";
import { trackingNotificationHandlers, trackingNotificationOnClickHandlers, trackingOnGoingNotificationOnClickHandlers } from "../utils/notificationUtils/trackingNotificationHandlers";
import { feedbackNotificationOnClickHandlers } from "../utils/notificationUtils/completeTripNotificationHandlers";

export const useOnNotificationClickHook = (setIsLoading) => {
  const navigation = useNavigation();

  const { user, setUser } = useContext(UserContext);

  const [initialScreen, setInitialScreen] = useState("");
  const [initialParams, setInitialParams] = useState(undefined);

  const handleInitialScreen = async () => {
    setIsLoading(true);
    try {
      const isValid = await isValidToken();
      // const user = await getUserData();
      // console.log(isValid);
      if (isValid) {
        // console.log(user);
        let userData = user;
        if (!userData) {
          const loginUserId = await getUserIdViaToken();
          // console.log(loginUserId);
          if (loginUserId) {
            userData = await getProfile(loginUserId);
            // console.log(userData);
            if (userData) {
              setUser(userData);
              // await setUserData(userData);
            }
          }
        }
        SignalR.updateToken(await getString("token"));
        // console.log(user);
        // console.log(await getUserIdViaToken());
        // console.log(determineDefaultScreen(userData));
        setInitialScreen("Home");
      } else {
        setInitialScreen("Login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialScreen && initialScreen != "Login") {
      navigation.reset({
        index: 0,
        routes: [{ name: initialScreen }],
      });
    }
  }, [initialScreen]);

  useEffect(() => {
    handleInitialScreen();
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      if (remoteMessage.data.action == "bookingDetail") {
        if (remoteMessage.data.status == "ARRIVE_AT_DROPOFF") {
          feedbackNotificationOnClickHandlers(remoteMessage.data.bookingDetailId, navigation);
        } else if (remoteMessage.data.status == "GOING_TO_PICKUP") {
          trackingNotificationOnClickHandlers(remoteMessage.data.bookingDetailId, navigation);
        } else if (remoteMessage.data.status == "GOING_TO_DROPOFF") {
          trackingOnGoingNotificationOnClickHandlers(remoteMessage.data.bookingDetailId, navigation);
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
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          if (remoteMessage.data.action == "bookingDetail") {
            // if (remoteMessage.data.status == "ARRIVE_AT_DROPOFF") {
            //   setInitialScreen("Feedback");
            //   setInitialParams({
            //     bookingDetailId: remoteMessage.data.bookingDetailId,
            //   });
            // } else if (remoteMessage.data.status == "GOING_TO_PICKUP") {
            //   setInitialScreen("TrackingLocation");
            //   setInitialParams({
            //     bookingDetailId: remoteMessage.data.bookingDetailId,
            //   });
            // } else if (remoteMessage.data.status == "GOING_TO_DROPOFF") {
            //   setInitialScreen("TrackingOngoingLocation");
            //   setInitialParams({
            //     bookingDetailId: remoteMessage.data.bookingDetailId,
            //   });
            // }

          } else if (remoteMessage.data.action == "login") {
            setUser(null);
            // await setUserData(null);
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }
        }
      });
  }, []);

  useEffect(() => {
    handleInitialScreen();
    // App is opened from background state
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      if (remoteMessage.data.action == "payment") {
        paymentNotificationOnClickHandlers(remoteMessage.data, navigation);
      } else if (remoteMessage.data.action == "login") {
        setUser(null);
        // await setUserData(null);
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    });

    // App is opened from a quit state
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          if (remoteMessage.data.action == "payment") {
            setInitialScreen("WalletTransactionDetail");
            setInitialParams({
              walletTransactionId: remoteMessage.data.walletTransactionId,
            });
          } else if (remoteMessage.data.action == "login") {
            setUser(null);
            // await setUserData(null);
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }
        }
      });
  }, []);

  return { initialScreen, initialParams };
};

import { useNavigation, useRoute } from "@react-navigation/native";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { SafeAreaView } from "react-native";
import Header from "../../components/Header/Header";
import { HStack, Image, Text, VStack, View } from "native-base";
import { themeColors, vigoStyles } from "../../assets/theme";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import { useErrorHandlingHook } from "../../hooks/useErrorHandlingHook";
import { GiftedChat, Send, Day } from "react-native-gifted-chat";
import { PaperAirplaneIcon } from "react-native-heroicons/outline";
import firestore from "@react-native-firebase/firestore";
import { getErrorMessage, handleError } from "../../utils/alertUtils";
import { getVehicles } from "../../service/vehicleService";
import { sendMessage } from "../../service/firebaseService";

const MessageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { user } = useContext(UserContext);

  const avatarUrl = user?.avatarUrl;

  const { driver, bookingDetailId } = route.params as any;

  // console.log(driver);

  const [messages, setMessages] = useState([] as any[]);
  const [vehiclePlate, setVehiclePlate] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const { isError, setIsError, errorMessage, setErrorMessage } =
    useErrorHandlingHook();

  const getData = async () => {
    try {
      setIsLoading(true);

      const vehicles = await getVehicles(driver.id);
      // console.log(vehicles);
      if (vehicles && vehicles.length > 0) {
        const vehicle = vehicles[0];
        setVehiclePlate(vehicle.licensePlate);
        // console.log(vehicle.licensePlate);
      } else {
        // console.log("False Vehicle");
        // setIsSubmitted(false);
      }

      // const msgResponse = await firestore()
      //   .collection("vigo-messages")
      //   .doc(bookingDetailId)
      //   .collection("messages")
      //   .orderBy("createdAt", "desc")
      //   .get();

      // const allMessages = msgResponse.docs.map((docSanp) => {
      //   return {
      //     ...docSanp.data(),
      //     createdAt: docSanp.data().createdAt.toDate(),
      //   };
      // });
      // // console.log(bookingDetailId);

      // setMessages(allMessages);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // getMessages();
    getData();

    const messageUnsubscriber = firestore()
      .collection("vigo-messages")
      .doc(bookingDetailId)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const allMessages = snapshot.docs.map((docSnap) => {
          return {
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt?.toDate(),
          };
        });
        setMessages(allMessages);
      });

    return () => messageUnsubscriber();
  }, []);

  const onSendMessage = useCallback(async (messages: any[]) => {
    try {
      // setMessages((prevMessages) => GiftedChat.append(prevMessages, messages));
      const msg = messages[0];
      const userMsg = {
        ...msg,
        sentBy: user.id,
        sentTo: driver.id,
        createdAt: new Date(),
      };
      // console.log(userMsg);
      setMessages((prevMessages) => GiftedChat.append(prevMessages, userMsg));
      // await firestore()
      //   .collection("vigo-messages")
      //   .doc(bookingDetailId)
      //   .collection("messages")
      //   .add({
      //     ...userMsg,
      //     createdAt: firestore.FieldValue.serverTimestamp(),
      //   });
      await sendMessage(bookingDetailId, userMsg);
    } catch (error) {
      handleError("Có lỗi xảy ra", getErrorMessage(error));
    }
  }, []);

  return (
    <SafeAreaView style={vigoStyles.container}>
      <Header
        title={
          <HStack alignItems="center">
            <Image
              source={
                driver.avatarUrl
                  ? { uri: driver.avatarUrl }
                  : require("../../assets/images/no-image.jpg")
              }
              // style={styles.image}
              alt="Ảnh đại diện khách hàng"
              size={35}
              mr={3}
              borderRadius={100}
            />
            <VStack>
              <Text bold fontSize="lg" color="white">
                {driver?.name}
              </Text>
              {vehiclePlate && <Text color="white">{vehiclePlate}</Text>}
            </VStack>
          </HStack>
        }
        backButtonDirection="down"
      />
      <View style={[vigoStyles.body]}>
        <ViGoSpinner isLoading={isLoading} />

        <ErrorAlert isError={isError} errorMessage={errorMessage}>
          <GiftedChat
            locale={"vi"}
            messages={messages}
            onSend={(messages) => onSendMessage(messages)}
            user={{
              _id: user.id,
              avatar: user.avatarUrl
                ? user.avatarUrl
                : require("../../assets/images/no-image.jpg"),
              name: user.name,
            }}
            placeholder="Nhập tin nhắn..."
            renderDay={(props) => {
              return <Day {...props} />;
            }}
            renderSend={(props) => {
              return (
                <Send
                  {...props}
                  containerStyle={{
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                >
                  <PaperAirplaneIcon size={20} color={themeColors.primary} />
                </Send>
              );
            }}
          />
        </ErrorAlert>
      </View>
    </SafeAreaView>
  );
};

export default memo(MessageScreen);

import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
    ScrollView,
    View,
    Avatar,
    Text,
    Box,
    HStack,
    Icon,
    Button,
    useTheme,
    VStack,
    Divider,
    Input,
    TextArea,
    Flex,
    Center,
} from "native-base";
import { ArrowsRightLeftIcon, CalendarIcon, StarIcon } from "react-native-heroicons/solid";

import { useNavigation } from "@react-navigation/native";

import { MinusIcon } from "react-native-heroicons/solid";
import {
    CalendarDaysIcon,
    ClockIcon,
    MapPinIcon,
    PhoneIcon,
    ArrowsUpDownIcon,
    CurrencyDollarIcon,
    ArrowSmallRightIcon
} from "react-native-heroicons/outline";
import { themeColors } from "../../assets/theme";
import Header from "../../components/Header/Header";
import {
    getBookingById,
    getBookingDetail,
    getBookingDetailById,
} from "../../service/bookingService";
import ViGoSpinner from "../../components/Spinner/ViGoSpinner";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import OnGoingScreen from "../History/OnGoingScreen";
import CancelScreen from "../History/CancelScreen";
import HistoryScreen from "../History/HistoryScreen";
import PendingScreen from "../History/PendingScreen";
import SelectRouteHeader from "../../components/Header/SelectRouteHeader";
export const DetailBookingScreen = ({ route }) => {
    const { bookingDetail } = route.params
    const theme = useTheme();
    const navigation = useNavigation();
    //const [bookingDetails, setBookingDetail] = useState(null);

    const [isGoingLoading, setIsGoingLoading] = useState(false);
    const [isPendingLoading, setIsPendingLoading] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [isCancelLoading, setIsCancelLoading] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const Tab = createMaterialTopTabNavigator();
    // const fetchData = async () => {
    //     try {
    //         getBookingDetailById(bookingDetail.id).then((response) => {
    //             console.log("bookingDetail", response.data);
    //             setBookingDetail(response.data);
    //             setIsLoading(false)
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // useEffect(() => {
    //     setIsLoading(true)
    //     fetchData();
    // }, []);
    console.log("bookingDetailssss", bookingDetail)
    return (
        <View flex={1} backgroundColor="white">
            <SelectRouteHeader
                title="Chi tiết chuyến đi"
                subtitle="Bạn có thể xem lại chuyến đi theo màn hiện tại."
                onBack={() => navigation.goBack()}
            />

            <Flex direction="column" alignItems="center" justifyContent="center" >
                {/* <SelectRouteHeader
                title="Đánh giá"
                subtitle="Tài xế bạn đi như thế nào?"
                onBack={() => navigation.goBack()}
            /> */}
                {bookingDetail === null ? (<ViGoSpinner isLoading={isLoading} />)
                    : (
                        < View>
                            <Box borderRadius="md" alignItems="center" w="full">

                                <View>
                                    <Box style={[styles.cardInsideLocation, styles.shadowProp]}>

                                        <HStack alignItems="center">

                                            <HStack alignSelf="flex-start" justifyContent="center">
                                                <VStack alignSelf="center">
                                                    <MapPinIcon size={25} color="#00A1A1" />
                                                </VStack>

                                                <VStack alignItems="flex-start" justifyContent="center">
                                                    <Text style={styles.title}>Điểm đón</Text>

                                                    <Text
                                                        style={{
                                                            paddingLeft: 5,
                                                            paddingBottom: 5,
                                                            fontSize: 15,
                                                        }}
                                                        bold
                                                        isTruncated
                                                    >
                                                        {bookingDetail.customerRoute.startStation.name}
                                                    </Text>
                                                </VStack>
                                            </HStack>

                                        </HStack>
                                        <Divider _light={{
                                            bg: "gray.300"
                                        }} _dark={{
                                            bg: "muted.50"
                                        }} />
                                        <HStack alignItems="center" >

                                            <HStack alignSelf="flex-start" justifyContent="center">
                                                <VStack alignSelf="center">
                                                    <MapPinIcon size={25} color="#00A1A1" />
                                                </VStack>

                                                <VStack alignItems="flex-start" justifyContent="center">
                                                    <Text style={styles.title}>Điểm đến</Text>
                                                    <Text
                                                        style={{
                                                            paddingLeft: 5,
                                                            paddingBottom: 5,
                                                            fontSize: 15,
                                                        }}
                                                        bold
                                                        isTruncated
                                                    >
                                                        {bookingDetail.customerRoute.endStation.name}
                                                    </Text>
                                                </VStack>
                                            </HStack>

                                        </HStack>
                                    </Box>
                                    <Text py={1} bold fontSize={25}>Khoảng cách</Text>
                                    <Box p={3} style={[styles.cardInsideLocation, styles.shadowProp]}>
                                        <HStack space={5} alignItems="center">
                                            <Text w={160} fontSize={18} fontWeight="bold">
                                                Khoảng cách:
                                            </Text>
                                            <Text w={50} fontSize={18} >
                                                {bookingDetail.customerRoute.distance}
                                            </Text>
                                            <Text fontSize={18} >
                                                Km
                                            </Text>

                                        </HStack>
                                        <HStack space={5} alignItems="center">
                                            <Text w={160} fontSize={18} fontWeight="bold">

                                                khoảng thời gian
                                            </Text>
                                            <Text w={50} fontSize={18} >
                                                {bookingDetail.customerRoute.duration}
                                            </Text>
                                            <Text fontSize={18} >
                                                Phút
                                            </Text>
                                        </HStack>
                                    </Box>
                                    <HStack my={1} space={5} alignContent="center">
                                        <Text alignSelf="center" bold fontSize={25} pr={5}> Lộ trình đi</Text>
                                        <Box borderWidth="1" borderColor={themeColors.primary} py={2} borderRadius={10}>
                                            <HStack alignContent="center" >
                                                {bookingDetail.customerRoute.type == "ONE_WAY" ? (<ArrowSmallRightIcon size={25} alignSelf="center" color="black" />) :
                                                    (<ArrowsRightLeftIcon size={25} alignSelf="center" color="black" />)}
                                                <Text p={1} bold>
                                                    {bookingDetail.customerRoute.type == "ONE_WAY" ? "Một chiều" : "Hai chiều"}
                                                </Text >
                                                <CalendarDaysIcon size={25} alignSelf="center" color="black" />
                                                <Text p={1} bold>
                                                    {bookingDetail.customerRoute.routineType == "WEEKLY" ? "Theo tuần" : "Theo tháng"}
                                                </Text>
                                            </HStack>

                                        </Box>
                                    </HStack>

                                    <HStack alignItems="center" justifyContent="center" h="50%">
                                        <Center style={[styles.cardInsideDateTime, styles.shadowProp]} justifyContent="space-between">
                                            <Tab.Navigator screenOptions={({ route }) => ({
                                                lazy: true, // Tự động chuyển lazy thành true
                                            })}>
                                                <Tab.Screen
                                                    name="Đang đi"
                                                    children={({ navigation }) => (
                                                        <OnGoingScreen
                                                            id={bookingDetail.id}
                                                            navigation={navigation}
                                                            setIsLoading={setIsGoingLoading}
                                                            isLoading={isGoingLoading}
                                                        />
                                                    )}
                                                />
                                                <Tab.Screen
                                                    name="Đang đợi"
                                                    children={({ navigation }) => (
                                                        <PendingScreen
                                                            id={bookingDetail.id}
                                                            navigation={navigation}
                                                            setIsLoading={setIsPendingLoading}
                                                            isLoading={isPendingLoading}
                                                        />
                                                    )}
                                                />
                                                <Tab.Screen
                                                    name="Lịch sử"
                                                    children={({ navigation }) => (
                                                        <HistoryScreen
                                                            id={bookingDetail.id}
                                                            navigation={navigation}
                                                            setIsLoading={setIsHistoryLoading}
                                                            isLoading={isHistoryLoading}
                                                        />
                                                    )}
                                                />
                                                <Tab.Screen
                                                    name="Đã hủy"
                                                    children={({ navigation }) => (
                                                        <CancelScreen
                                                            id={bookingDetail.id}
                                                            navigation={navigation}
                                                            setIsLoading={setIsCancelLoading}
                                                            isLoading={isCancelLoading}
                                                        />
                                                    )}
                                                />
                                            </Tab.Navigator>
                                        </Center>

                                    </HStack>



                                </View>

                            </Box>
                        </View>)}
            </Flex>

            {/* <Box borderRadius={8} backgroundColor="#00A1A1" my={5} w="83%" alignSelf="center" alignItems="center">
                <Button onPress={handlePickBooking} backgroundColor="#00A1A1">Nhận chuyến</Button>
            </Box> */}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexGrow: 1,
        backgroundColor: "white",
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        width: "100%",
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    container: {
        flexDirection: "column", // inner items will be added vertically
        flexGrow: 1, // all the available vertical space will be occupied by it
        justifyContent: "space-between", // will create the gutter between body and footer
    },
    cardInsideDateTime: {
        backgroundColor: "white",
        borderRadius: 10,

        paddingHorizontal: 15,
        width: "40%",
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: "row",
        flexGrow: 1,
        margin: 5,
    },
    cardInsideLocation: {
        backgroundColor: "white",
        borderRadius: 10,

        paddingHorizontal: 15,
        // width: "100%",
        marginVertical: 10,
        // marginHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 20,
        },
        shadowOpacity: 1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    body: {
        flex: 1,
    },
    title: {
        color: themeColors.primary,
        fontSize: 16,
        fontWeight: "bold",
        paddingTop: 10,
        paddingLeft: 5,
    },
    list: {
        paddingTop: 10,
        fontSize: 20,
    },
});

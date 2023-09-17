import React, { useEffect, useState } from 'react';
import { View, Avatar, Text, Box, HStack, Icon, Button, useTheme, VStack, Divider, Input, TextArea, Flex, useToast, Toast, ScrollView } from 'native-base';
import { StarIcon } from "react-native-heroicons/solid";
import { themeColors } from '../../assets/theme';
import Header from '../../components/Header/Header';
import SelectRouteHeader from '../../components/Header/SelectRouteHeader';
import { useNavigation } from '@react-navigation/native';
import { feedbackByBookingDetailId, getBookingDetailById } from '../../service/bookingService';
import ViGoSpinner from '../../components/Spinner/ViGoSpinner';


const FeedbackScreen = ({ route }) => {
    const theme = useTheme();
    const { bookingDetailId } = route.params
    console.log("item", bookingDetailId)
    loadBookingDetailWithId = () => {
        getBookingDetailById(bookingDetailId).then((response) => {
            setBookingDetail(response.data)
            setSelectedRating(response.data.driver.rate)
        });
    }
    useEffect(() => {

        loadBookingDetailWithId();
    }, [])
    const navigation = useNavigation();
    const [selectedRating, setSelectedRating] = useState(1);
    const [feedback, setFeedback] = useState("");
    const [bookingDetail, setBookingDetail] = useState(null); // Initialize as null

    const handleRatingClick = (rating) => {
        setSelectedRating(rating);
        console.log("rating", rating)
    };
    const sendFeedback = async () => {
        const requestData = {
            rate: selectedRating,
            feedback: feedback
        }
        await feedbackByBookingDetailId(bookingDetailId, requestData).then((response) => {
            if (response !== null) {
                Toast.show({
                    title: "Cảm ơn bạn đã đánh giá!",
                    placement: "bottom"
                })
                navigation.navigate("Home")

            }

        })
    };
    return (
        <Flex direction="column" alignItems="center" justifyContent="center" bg="white">
            <SelectRouteHeader
                title="Đánh giá"
                subtitle="Tài xế bạn đi như thế nào?"
                onBack={() => navigation.goBack()}
            />
            <ViGoSpinner isLoading={isLoading} />
            <ScrollView>
                {bookingDetail == null ? (<ViGoSpinner />) : (<Box>


                    <Box p={10}>
                        <VStack space={5} alignItems="center">
                            <Avatar
                                size="2xl"
                                source={{
                                    uri: `${bookingDetail.driver.avatarUrl}`, // Replace with the actual avatar URL
                                }}
                            />
                            <Text fontSize={25} fontWeight="bold">{bookingDetail.driver.name}</Text>
                            <Text fontSize={20}>{bookingDetail.driver.phone}</Text>
                        </VStack>
                    </Box>
                    <Box borderColor={themeColors.primary} borderRadius="md" p={4} alignItems="center">

                        <Text fontSize={20}>Đánh giá dịch vụ di chuyển của tài xế</Text>
                        {/* <HStack p={5} space={5} alignItems="center">
                    {Array.from({ length: (item.rate === null ? 1 : item.rate) }).map((_, index) => (
                        <Icon key={index} as={<StarIcon size={40} />} color={themeColors.primary} />
                    ))}

                </HStack> */}
                        <HStack p={5} space={5} alignItems="center">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <Icon
                                    key={rating}
                                    as={<StarIcon size={40} />}
                                    size={40}
                                    color={rating <= selectedRating ? themeColors.primary : 'gray.300'}
                                    onPress={() => handleRatingClick(rating)}
                                    cursor="pointer"
                                />
                            ))}
                        </HStack>
                        <HStack space="2xl" justifyContent="center">
                            <Text fontSize={20} fontWeight='medium'>Giá chuyến đi:</Text>
                            <Text fontSize={20} fontWeight='medium'>{bookingDetail.price} đ</Text>
                        </HStack>
                        <Divider my="2" _light={{
                            bg: "muted.800"
                        }} _dark={{
                            bg: "muted.50"
                        }} />
                        <VStack width={350}>
                            <Text fontSize={20} py={3} fontWeight='medium'>Nhập đánh giá:</Text>
                            <TextArea h={20} onChangeText={(text) => setFeedback(text)} placeholder="Cụ thể (Không bắt buộc)" w="100%" maxW="350" />
                        </VStack>
                        <Button
                            my={4} mb={5}
                            backgroundColor={themeColors.primary}
                            onPress={sendFeedback}
                            startIcon={<Icon as={<StarIcon />} color={themeColors.linear} />}
                        >
                            Gửi đánh giá
                        </Button>
                    </Box>
                </Box>)}
            </ScrollView>
        </Flex>

    );
};

export default FeedbackScreen;
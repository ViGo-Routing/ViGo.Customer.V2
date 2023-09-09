import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import SignalRService from "../../utils/signalRUtils.js"; // Adjust the path
import { UserContext } from "../../context/UserContext";
import { MapPinIcon } from "react-native-heroicons/solid";
import { themeColors } from "../../assets/theme/index.jsx";
import { Alert, Box, Center, CloseIcon, HStack, IconButton, Spinner, Text, VStack } from "native-base";
import Header from "../../components/Header/Header.jsx";
import MapViewDirections from "react-native-maps-directions";
const TrackingLocationScreen = ({ route }) => {
    const { user } = useContext(UserContext)
    const { bookingDetail } = route.params
    const customerId = `${user.id}`; // Replace with actual customer ID
    const tripId = bookingDetail.id; // Replace with actual trip ID

    const [driverLocation, setDriverLocation] = useState({
        latitude: 0,
        longitude: 0,
    });

    const [customerLocation, setCustomerLocation] = useState(null); // Initialize as null

    useEffect(() => {
        SignalRService.registerCustomer(tripId)
        const locationTrackingListener = SignalRService.onLocationTracking((latitude, longitude) => {
            setDriverLocation({ latitude, longitude });
        });

        const locationUpdateInterval = setInterval(() => {
            Geolocation.getCurrentPosition(
                position => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    console.log(latitude, longitude)
                    setCustomerLocation({ latitude, longitude });
                },
                error => console.error(error),
                { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
            );
        }, 3000);

        return () => {
            locationTrackingListener && locationTrackingListener.off(); // Check if the listener exists
            clearInterval(locationUpdateInterval);
        };
    }, []);
    let calculatedRegion = null;
    if (customerLocation && driverLocation.latitude !== 0 && driverLocation.longitude !== 0) {
        calculatedRegion = {
            latitude: (driverLocation.latitude + customerLocation.latitude) / 2,
            longitude: (driverLocation.longitude + customerLocation.longitude) / 2,
            latitudeDelta: Math.abs(driverLocation.latitude - customerLocation.latitude) * 1.5,
            longitudeDelta: Math.abs(driverLocation.longitude - customerLocation.longitude) * 1.5,
        };
    }
    return (
        <View style={{ flex: 1 }}>
            <Header title="Chi tiết" />
            {customerLocation == null && driverLocation.latitude === 0
                && driverLocation.longitude === 0 && (<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text bold p={1} >
                        Đang tải
                    </Text>

                    <Spinner color={themeColors.primary} />
                </View>)}
            {customerLocation != null
                && driverLocation.latitude !== 0
                && driverLocation.longitude !== 0
                && ( // Only render map when customerLocation is available
                    <MapView
                        style={{ flex: 1 }}
                        initialRegion={{
                            latitude: customerLocation.latitude,
                            longitude: customerLocation.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        <MapViewDirections
                            origin={{
                                latitude: driverLocation.latitude,
                                longitude: driverLocation.longitude,
                            }}
                            destination={{
                                latitude: customerLocation.latitude,
                                longitude: customerLocation.longitude,
                            }}
                            apikey="AIzaSyCIYCycKF24mQXN1pJYFfCO-6azSETj_Qc"
                            strokeWidth={3}
                            strokeColor="#00A1A1"
                            mode="motobike"
                        //onReady={handleDirectionsReady}
                        />

                        <Marker
                            coordinate={{
                                latitude: driverLocation.latitude,
                                longitude: driverLocation.longitude,
                            }}
                            title="Driver"
                            icon={require("../../assets/icons/vigobike.png")}
                        />
                        <Marker
                            coordinate={{
                                latitude: customerLocation.latitude,
                                longitude: customerLocation.longitude,
                            }}
                            title="Customer"
                        >
                            <MapPinIcon width={32} height={32} fill={themeColors.primary} />
                        </Marker>
                    </MapView>
                )}
        </View>
    );
};

export default TrackingLocationScreen;
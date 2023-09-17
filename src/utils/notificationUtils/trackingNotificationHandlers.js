export const trackingNotificationHandlers = (data, navigation) => {
    console.log(data)
    if (data) {
        if (data) {
            navigation.navigate("TrackingLocation", { bookingDetailId: data });
        }
    }
};
export const trackingOnGoingNotificationHandlers = (data, navigation) => {
    console.log(data)
    if (data) {
        if (data) {
            navigation.navigate("TrackingOnGoingLocation", { bookingDetailId: data });
        }
    }
};


export const trackingNotificationOnClickHandlers = (data, navigation) => {
    if (data) {
        if (data) {
            navigation.navigate("TrackingLocation", { bookingDetailId: data });
        }
    }
};
export const trackingOnGoingNotificationOnClickHandlers = (data, navigation) => {
    if (data) {
        if (data) {
            navigation.navigate("TrackingOnGoingLocation", { bookingDetailId: data });
        }
    }
};

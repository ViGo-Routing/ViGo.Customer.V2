export const feedbackNotificationHandlers = (data, navigation) => {
    console.log(data)
    if (data) {
        if (data) {
            navigation.navigate("Feedback", { bookingDetailId: data });
        }
    }
};


export const feedbackNotificationOnClickHandlers = (data, navigation) => {
    if (data) {
        if (data) {
            navigation.navigate("Feedback", { bookingDetailId: data });
        }
    }
};

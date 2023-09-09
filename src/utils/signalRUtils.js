import { HubConnectionBuilder } from "@microsoft/signalr";

class SignalRService {
    constructor() {
        this.connection = new HubConnectionBuilder()
            .withUrl("https://vigo-api.azurewebsites.net/vigoGpsTrackingHub")
            .withAutomaticReconnect()
            .build();

        this.connection.start().catch(err => console.error(err));
    }
    updateToken(token) {
        this.connection.stop(); // Dừng kết nối hiện tại
        this.connection = new HubConnectionBuilder()
            .withUrl("https://vigo-api.azurewebsites.net/vigoGpsTrackingHub", {
                accessTokenFactory: () => token // Cập nhật token mới
            })
            .withAutomaticReconnect()
            .build();

        this.connection.start().catch(err => console.error(err));
    }
    onReceiveMessage(callback) {
        this.connection.on("ReceiveMessage", message => {
            callback(message);
        });
    }
    sendLocationUpdate(tripId, latitude, longitude) {
        const locationInfo = { latitude: latitude, longitude: longitude };
        this.connection.invoke("SendLocation", tripId, locationInfo);
    }
    registerCustomer(tripId) {

        this.connection.invoke("Register", tripId).catch(err => console.error(err));
    }
    sendMessage(message) {
        this.connection.invoke("SendMessage", message);
    }
    onLocationTracking(callback) {
        this.connection.on("locationTracking", locationInfo => {
            const { latitude, longitude } = JSON.parse(locationInfo);
            console.log({ latitude, longitude })
            callback(latitude, longitude);
        });
    }
}

export default new SignalRService();
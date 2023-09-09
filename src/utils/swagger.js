import apiManager from "./apiManager";


//AUTHENTICATION
//LOGIN
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjVmOTRkZDg2LTM3YjItNDNhMy05NjJiLTAzNmEzYzAzZDNjOSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJBZG1pbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFETUlOIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiYWRtaW5AZ21haWwuY29tIiwianRpIjoiZGRhY2MyNGUtNWUxNS00NTFiLWE2NzQtY2U2YjAxZTM1YTY1IiwiZXhwIjoxNjg3NDYwMTQ0LCJpc3MiOiJodHRwczovL3ZpZ28tYXBpLmF6dXJld2Vic2l0ZXMubmV0LyIsImF1ZCI6Imh0dHBzOi8vdmlnby1hcGkuYXp1cmV3ZWJzaXRlcy5uZXQvIn0.xlsDLG_lVN-eogmHPjx50ZjqTNj0DXv_H9hAhzqjMnY';
export const user_login = async data => {
    try {
        const result = await apiManager("/api/Authenticate/Mobile/Login", {
            method: "POST",
            headers: {
                'content-type': 'application/json-patch+json',
            },
            data: data,
        });
        console.log("result", result)
        return result;
    } catch (error) {
        return error.response.data;
    }
}

//REGISTER
export const user_register = async data => {
    try {
        const result = await apiManager("/api/Authentication/Register", {
            method: "POST",
            headers: {
                'content-type': 'application/json-patch+json'
            },
            data: data,
        });
        return result;
    } catch (error) {
        return error.response.data
    }
}

//BOOKING
//BOOKING FARECALCULATE
export const booking_fareCalculate = async data => {
    try {
        const result = await apiManager("/api/Booking/FareCalculate", {
            method: "POST",
            headers: {
                'content-type': 'application/json-patch+json'
            },
            data: data,
        });
        return result;
    } catch (error) {
        return error.response.data
    }
}

//GET LIST OF BOOKING
export const booking_getList = async data => {
    try {
        const result = await apiManager("/api/Booking", {
            method: "GET",
            headers: {
                'content-type': 'text/plain'
            },
            data: data,
        });
        return result;
    } catch (error) {
        return error.response.data
    }
}

//CREATE NEW BOOKING
export const booking_create = async data => {
    try {
        const result = await apiManager("/api/Booking", {
            method: "POST",
            headers: {
                'content-type': 'application/json-patch+json'
            },
            data: data,
        });
        return result;
    } catch (error) {
        return error.response.data
    }
}

//GET BOOOKING BY ID
export const booking_getById = async data => {
    try {
        const result = await apiManager("/api/Booking/{bookingId}", {
            method: "GET",
            headers: {
                'content-type': 'text/plain'
            },
            data: data
        });
        return result;
    } catch (error) {
        return error.response.data
    }
}

//BOOKING DETAIL
//GET BOOKING DETAIL BY BOOKING DETAIL ID
export const bookingDetail_getById = async data => {
    try {
        const result = await apiManager("/api/BookingDetail/{bookingDetailId}", {
            method: "GET",
            headers: {
                'content-type': 'text/plain'
            },
            data: data,
        });
        return result;
    } catch (error) {
        return error.response.data
    }
}

//GET LIST OF BOOKING DETAIL THAT ASSIGNED TO DRIVER
export const bookingDetail_getByDriverId = async data => {
    try {
        const result = await apiManager("/api/BookingDetail/{driverId}", {
            method: "GET",
            headers: {
                'content-type': 'text/plain'
            },
            data: data,
        });
        return result;
    } catch (error) {
        return error.response.data
    }
}

//GET LIST OF BOOKING DETAIL THAT BELONG TO BOOKING
export const bookingDetail_getByBookingId = async data => {
    try {
        const result = await apiManager("/api/BookingDetail/{bookingId}", {
            method: "GET",
            headers: {
                'content-type': 'text/plain'
            },
            data: data,
        });
        return result;
    } catch (error) {
        return error.response.data
    }
}

//PAYMENT 
//GENERATE TEST PAYMENT URL FOR VNPAY
export const payment_generate = async data => {
    try {
        const result = await apiManager("/api/Payment/Generate/VnPay", {
            method: "GET",
            headers: {
                'content-type': 'text/plain'
            },
            data: data,
        });
        return result;
    } catch (error) {
        return error.response.data
    }
}

//VNPAY CALLBACK URL
export const payment_callback = async data => {
    try {
        const result = await apiManager("/api/Payment/Callback/VnPay", {
            method: "GET",
            headers: {
                'content-type': 'text/plain'
            },
            data: data,
        });
        return result;
    } catch (error) {
        return error.response.data
    }
}

//ROUTE 
//CREATE NEW ROTE
export const route_create = async data => {
    try {
        const result = await apiManager("/api/Route", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                'content-type': 'application/json-patch+json'
            },
            data: data,
        });
        console.log("API response:", result);
        return result;

    } catch (error) {
        return error.response.data
    }
}

//GET ROUTE INFOR
export const route_getRoute = async data => {
    try {
        const result = await apiManager("/api/Route", {
            method: "GET",
            headers: {
                'content-type': 'text/plain'
            },
            data: data,
        });
        return result;
    } catch (error) {
        return error.response.data
    }
}

//GET ROUTE INFOR FOR CURRENT USER
export const route_getRouteCurrentUser = async data => {
    try {
        const result = await apiManager("/api/Route/CurrentUser", {
            method: "GET",
            headers: {
                'content-type': 'text/plain'
            },
            data: data,
        });
        return result;
    } catch (error) {
        return error.response.data
    }
}

//GET ROUTE INFOR BY ROUTE ID
export const route_getRouteByRouteId = async data => {
    try {
        const result = await apiManager("/api/Route/{routeId}", {
            method: "GET",
            headers: {
                'content-type': 'text/plain'
            },
            data: data,
        });
        return result;
    } catch (error) {
        return error.response.data
    }
}
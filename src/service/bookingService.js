import { Toast } from "native-base";
import apiManager from "../utils/apiManager";
import { getErrorMessage } from "../utils/alertUtils";

export const createFareCalculate = async (requestData) => {
  try {
    console.log("Fare", requestData);
    const response = await apiManager.post(
      "/api/Booking/FareCalculate",
      requestData
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      // Assuming the error response has a 'data' property containing error details
      const errorDetails = error.response.data;
      console.log("Fail to create booking calculate fare", errorDetails);
      Toast.show({
        title: errorDetails,
        placement: "bottom",
      });
      return null;
    } else {
      console.log("Error response structure not recognized.");
      return null;
    }
  }
};

export const createBooking = async (requestData) => {
  console.log(requestData);
  try {
    const response = await apiManager.post("/api/Booking", requestData);
    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      // Assuming the error response has a 'data' property containing error details
      const errorDetails = error.response.data;
      console.log("Create Booking failed", errorDetails);
      Toast.show({
        title: errorDetails,
        placement: "bottom",
      });
      return null;
    } else {
      console.log("Error response structure not recognized.");
      return null;
    }
  }
};

export const getPayment = async (bookingID, amount) => {
  try {
    const response = await apiManager.get(
      `/api/Payment/Generate/VnPay?bookingId=${bookingID}&amount=${amount}`,
      requestData
    );
    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      // Assuming the error response has a 'data' property containing error details
      const errorDetails = error.response.data;
      console.log("Create Booking failed", errorDetails);
      return null;
    } else {
      console.log("Error response structure not recognized.");
      return null;
    }
  }
};
export const getBookingDetail = async (
  customerId,
  status = undefined,
  pageSize = 10,
  pageNumber = -1
) => {
  try {
    const url = status
      ? `api/BookingDetail/Customer/${customerId}?status=${status}&pageSize=${pageSize}&pageNumber=${pageNumber}`
      : `api/BookingDetail/Customer/${customerId}?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    const response = await apiManager.get(url);
    return response;
  } catch (error) {
    console.error("Get Payment failed:", getErrorMessage(error));
  }
};

export const getBookingDetailById = async (customerId) => {
  try {
    const response = await apiManager.get(`/api/BookingDetail/${customerId}`);
    return response;
  } catch (error) {
    console.error("Get Booking Detail failed:", error);
  }
};
export const getBookingById = async (bookingId) => {
  try {
    const response = await apiManager.get(`/api/Booking/${bookingId}`);
    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      // Assuming the error response has a 'data' property containing error details
      const errorDetails = error.response.data;
      console.log("errorDetails", errorDetails);
      return null;
    } else {
      console.log("Error response structure not recognized.");
      return null;
    }
  }
};
export const getBookingByCustomerId = async (
  customerId,
  pageSize,
  pageNumber
) => {
  try {
    const response = await apiManager.get(
      `/api/Booking/Customer/${customerId}?PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      // Assuming the error response has a 'data' property containing error details
      const errorDetails = error.response.data;
      console.log("errorDetails", errorDetails);
      return null;
    } else {
      console.log("Error response structure not recognized.");
      return null;
    }
  }
};
export const getBookingDetailByBookingId = async (
  bookingId,
  status = undefined,
  pageSize = 10,
  pageNumber = -1,
  type = "MAIN_ROUTE,ROUND_TRIP_ROUTE"
) => {
  try {
    const url = status
      ? `api/BookingDetail/Booking/${bookingId}?status=${status}&pageSize=${pageSize}&pageNumber=${pageNumber}`
      : `api/BookingDetail/Booking/${bookingId}?Type=${type}&pageSize=${pageSize}&pageNumber=${pageNumber}`;
    const response = await apiManager.get(url);
    console.log(url);
    return response;
  } catch (error) {
    console.error("Get Payment failed:", getErrorMessage(error));
  }
};

export const updateBookingById = async (bookingId, requestData) => {
  console.log("updateBookingById", requestData);
  try {
    const response = await apiManager.put(
      `/api/Booking/${bookingId}`,
      requestData
    );
    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      // Assuming the error response has a 'data' property containing error details
      const errorDetails = error.response.data;
      Toast.show({
        title: errorDetails,
        placement: "bottom",
      });
      return null;
    } else {
      console.log("Error response structure not recognized.");
      return null;
    }
  }
};

export const feedbackByBookingDetailId = async (
  bookingDetailId,
  requestData
) => {
  console.log("requestData", bookingDetailId, requestData);
  try {
    const response = await apiManager.put(
      `/api/BookingDetail/Feedback/${bookingDetailId}`,
      requestData
    );
    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      // Assuming the error response has a 'data' property containing error details
      const errorDetails = error.response.data;
      Toast.show({
        title: errorDetails,
        placement: "bottom",
      });
      console.log("update Booking failed", errorDetails);
      return null;
    } else {
      console.log("Error response structure not recognized.");
      return null;
    }
  }
};
export const getAvailableBookings = async (
  userId,
  pageSize = 10,
  pageNumber = 10
) => {
  const response = await apiManager.get(
    `api/Booking/Driver/Available/${userId}?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response.data;
};

export const getBooking = async (bookingId) => {
  const response = await apiManager.get(`api/Booking/${bookingId}`);
  return response.data;
};

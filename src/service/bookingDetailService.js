import { Alert } from "react-native";
import apiManager from "../utils/apiManager";

export const getAvailableBookingDetails = async (
  userId,
  pageSize,
  pageNumber
) => {
  // try {
  const response = await apiManager.get(
    `/api/BookingDetail/Driver/Available/${userId}?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response;
  // } catch (error) {
  //   console.error("Create Payment failed:", error);
  // }
};

export const getAvailableBookingDetailsByBooking = async (
  userId,
  bookingId,
  pageSize = -1,
  pageNumber = 1
) => {
  const response = await apiManager.get(
    `api/BookingDetail/Driver/Available/${userId}/${bookingId}?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response.data;
};

export const pickBookingDetailById = async (bookingDetailId) => {
  // console.log(bookingDetailId);
  // try {
  const response = await apiManager.post(
    `/api/BookingDetail/Driver/Pick/${bookingDetailId}`
  );
  return response;
};

export const pickBookingDetails = async (bookingDetailIds) => {
  const response = await apiManager.post(
    `api/BookingDetail/Driver/Pick`,
    bookingDetailIds
  );
  return response.data;
};

export const getBookingDetailByuserId = async (
  userId,
  minDate = null,
  maxDate = null,
  minPickupTime = null,
  status = "",
  pageSize = 10,
  pageNumber = 1,
  orderBy = null
) => {
  // try {
  let endpoint = `/api/BookingDetail/Driver/${userId}?pageSize=${pageSize}&pageNumber=${pageNumber}`;
  if (minDate != null) {
    endpoint += `&minDate=${minDate}`;
  }
  if (maxDate != null) {
    endpoint += `&maxDate=${maxDate}`;
  }
  if (minPickupTime != null) {
    endpoint += `&minPickupTime=${minPickupTime}`;
  }
  if (status) {
    endpoint += `&status=${status}`;
  }
  if (orderBy) {
    endpoint += `&orderBy=${orderBy}`;
  }

  const response = await apiManager.get(endpoint);
  return response;
  // } catch (error) {
  //   if (error.response && error.response.data) {
  //     // Assuming the error response has a 'data' property containing error details
  //     const errorDetails = error.response.data;
  //     Alert.alert(errorDetails);
  //     return null;
  //   } else {
  //     console.log("Error response structure not recognized.");
  //     return null;
  //   }
  // }
};

export const updateStatusBookingDetail = async (
  bookingDetailId,
  requestData
) => {
  // console.log(requestData);
  // try {
  const response = await apiManager.put(
    `/api/BookingDetail/UpdateStatus/${bookingDetailId}`,
    requestData
  );
  return response;
  // } catch (error) {
  //   console.error("Driver Pick Booking Detail By Id failed:", error);
  //   return null;
  // }
};

export const getBookingDetail = async (bookingDetailId) => {
  const response = await apiManager.get(`api/BookingDetail/${bookingDetailId}`);
  return response.data;
};

export const getBookingDetailPickFee = async (bookingDetailId) => {
  const response = await apiManager.get(
    `api/BookingDetail/DriverFee/${bookingDetailId}`
  );
  return response.data;
};

export const getDriverSchedulesForPickingTrip = async (bookingDetailId) => {
  const response = await apiManager.get(
    `api/BookingDetail/Driver/PickSchedules/${bookingDetailId}`
  );
  return response.data;
};

export const getUpcomingTrip = async (userId) => {
  const response = await apiManager.get(`api/BookingDetail/Upcoming/${userId}`);

  return response.status == 204 ? null : response.data;
};

export const getCurrentTrip = async (userId) => {
  const response = await apiManager.get(`api/BookingDetail/Current/${userId}`);

  return response.status == 204 ? null : response.data;
};

export const cancelBookingDetail = async (bookingDetailId) => {
  const response = await apiManager.put(
    `api/BookingDetail/Cancel/${bookingDetailId}`
  );

  return response.data;
};

export const getCancelFee = async (bookingDetailId) => {
  const response = await apiManager.get(
    `api/BookingDetail/Cancel/Fee/${bookingDetailId}`
  );
  return response.data;
};

export const getCustomerBookingDetails = async (
  customerId,
  minDate = null,
  maxDate = null,
  status = "",
  pageSize = 10,
  pageNumber = 1,
  orderBy = null
) => {
  let endpoint = `/api/BookingDetail/Customer/${customerId}?pageSize=${pageSize}&pageNumber=${pageNumber}`;

  if (minDate != null) {
    endpoint += `&minDate=${minDate}`;
  }
  if (maxDate != null) {
    endpoint += `&maxDate=${maxDate}`;
  }
  if (status) {
    endpoint += `&status=${status}`;
  }
  if (orderBy) {
    endpoint += `&orderBy=${orderBy}`;
  }

  const response = await apiManager.get(endpoint);
  return response.data;
};

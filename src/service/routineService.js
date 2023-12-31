import { Toast } from "native-base";
import apiManager from "../utils/apiManager";
import { handleError } from "../utils/alertUtils";

export const createRoutine = async (requestData) => {
  console.log("createRoutine", requestData);
  //   try {
  const response = await apiManager.post("/api/RouteRoutine", requestData);
  return response;
  //   } catch (error) {
  //     if (error.response && error.response.data) {
  //       // Assuming the error response has a 'data' property containing error details
  //       const errorDetails = error.response.data;
  //       console.log("createRoutine", errorDetails);
  //       Toast.show({
  //         title: errorDetails,
  //         placement: "bottom",
  //       });
  //       return null;
  //     } else {
  //       console.log("Error response structure not recognized.");
  //       return null;
  //     }
  //   }
};
export const checkRoutine = async (requestData) => {
  console.log("checkRoutine", requestData);
  // try {
  const response = await apiManager.post(
    "/api/RouteRoutine/Validate",
    requestData
  );
  return response;
  // } catch (error) {
  // if (error.response && error.response.data) {
  //     // Assuming the error response has a 'data' property containing error details
  //     const errorDetails = error.response.data;
  //     console.log("checkRoutine", errorDetails)
  //     Toast.show({
  //         title: errorDetails,
  //         placement: "bottom",
  //     });
  //     return null;
  // } else {
  //     console.log("Error response structure not recognized.");
  //     return null;
  // }
  // handleError("Có lỗi xảy ra", error);
  // }
};

export const checkRoundTripRoutines = async (requestData) => {
  // try {
  const response = await apiManager.post(
    `/api/RouteRoutine/Validate/RoundTrip`,
    requestData
  );
  return response;
  // } catch (error) {
  //   handleError("Có lỗi xảy ra", error);
  // }
};

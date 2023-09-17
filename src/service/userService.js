import { getErrorMessage } from "../utils/alertUtils";
import apiManager from "../utils/apiManager";
import { removeItem } from "../utils/storageUtils";
import auth from "@react-native-firebase/auth";

export const updateUserFcmToken = async (userId, fcmToken) => {
  // console.log(fcmToken);
  // try {
  const response = await apiManager.put(`api/User/UpdateFcm/${userId}`, {
    id: userId,
    fcmToken: fcmToken,
  });
  // } catch (err) {
  //   console.error(err);
  //   if (err.response) {
  //     console.error(err.response.data);
  //     console.error(err.response.status);
  //     // console.error(err.response.headers);
  //   }
  // }
};

export const editProfile = async (id, requestData) => {
  // console.log("requestData", requestData);
  const response = await apiManager.put(
    `/api/User/${id}`,
    requestData /*{
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json-patch+json",
      },
    }*/
  );

  return response.data;
};

export const getProfile = async (id) => {
  // try {
  const response = await apiManager.get(
    `/api/User/${id}` /*{
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json-patch+json",
      }
    }*/
  );
  // console.log("aaaaaaas", response.data);
  return response.data;
  // } catch (error) {
  //   console.error("Get Profile failed:", getErrorMessage(error));
  // }
};

export const getUserAnalysis = async (userId) => {
  const response = await apiManager.get(`api/User/Analysis/${userId}`);
  return response.data;
};

export const logUserOut = async (setUser, navigation) => {
  await removeItem("token");
  await auth().signOut();
  // await setUserData(null);
  setUser(null);

  navigation.reset({
    index: 0,
    routes: [{ name: "Login" }],
  });
};

export const getBookingDetailCustomer = async (bookingDetailId) => {
  const response = await apiManager.get(
    `api/User/BookingDetail/${bookingDetailId}`
  );
  return response.data;
};

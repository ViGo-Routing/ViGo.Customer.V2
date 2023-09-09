import apiManager from "../utils/apiManager";

export const updateUserFcmToken = async (userId, fcmToken) => {
  console.log(fcmToken);
  try {
    const response = await apiManager.put(`api/User/UpdateFcm/${userId}`, {
      id: userId,
      fcmToken: fcmToken,
    });
    if (response.status != 200) {
      throw new Error(response.data);
    }
  } catch (err) {
    console.error(err);
    if (err.response) {
      console.error(err.response.data);
      console.error(err.response.status);
      // console.error(err.response.headers);
    }
  }
};

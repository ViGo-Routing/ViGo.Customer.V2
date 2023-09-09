import axios from "axios";
import { Alert } from "react-native";
import { getString, setString } from "./storageUtils";

const baseURL = "https://vigo-api.azurewebsites.net";
const apiManager = axios.create({
  baseURL: baseURL,
  responseType: "json",
  headers: {
    Accept: "application/json",
  },
});

const updateToken = async (newToken) => {
  await setString("token", newToken);
};

export const login = async (phone, firebaseToken) => {
  // try {
  const requestData = {
    // password: password,
    firebaseToken: firebaseToken,
    phone: phone,
    role: "CUSTOMER",
  };
  const response = await axios.post(
    `${baseURL}/api/Authenticate/Mobile/Login`,
    requestData
  );

  if (response.data.user.role != "CUSTOMER") {
    throw new Error("Người dùng không hợp lệ!");
  }

  const newToken = response.data.token;
  updateToken(newToken);
  return response.data;
};

export const register = async (name, phone, firebaseUid) => {
  // try {
  const requestData = {
    name: name,
    phone: phone,
    firebaseUid: firebaseUid,
    // password: password,
    role: "CUSTOMER",
  };

  const response = await axios.post(
    `${baseURL}/api/Authenticate/Register`,
    requestData
  );

  return response.data;
  // } catch (err) {
  //   // console.error(err.response.data);
  //   Alert.alert(
  //     "Có lỗi xảy ra khi đăng ký",
  //     "Chi tiết: " + (err.response ? err.response.data : err.message)
  //   );
  // }
};

apiManager.interceptors.request.use(
  async (config) => {
    config.headers.Authorization = `Bearer ${await getString("token")}`;
    return config;
  },
  (error) => {
    if (error.response) {
      Alert.alert("Có lỗi xảy ra", error.response.data);
    } else {
      Alert.alert("Có lỗi xảy ra");
    }
    return Promise.reject(error);
  }
);

export default apiManager;

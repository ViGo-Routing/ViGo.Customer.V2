import axios from "axios";
import { Alert } from "react-native";

const baseURL = "https://vigo-api.azurewebsites.net";
const apiManager = axios.create({
  baseURL: baseURL,
  responseType: "json",
  headers: {
    Accept: "application/json",
  },
});

const updateToken = (newToken) => {
  token = newToken;
};

export const login = async (phone, password) => {
  try {

    const requestData = {
      password: password,
      phone: phone,
      role: "CUSTOMER",
    };
    console.log(requestData)
    const response = await axios.post(
      `${baseURL}/api/Authenticate/Mobile/Login`,
      requestData
    );
    const newToken = response.data.token;
    updateToken(newToken); // Update the token value
    console.log("Login successful!");
    return response.data;
  } catch (error) {
    if (error.response) {
      Alert.alert("Có lỗi xảy ra", error.response.data);
    } else {
      Alert.alert("Có lỗi xảy ra");
    }
    console.error("Login failed:", error);
  }
};

export const register = async (name, phone, password) => {
  // try {
  const requestData = {
    name: name,
    phone: phone,
    // firebaseUid: firebaseUid,
    password: password,
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
  (config) => {
    config.headers.Authorization = `Bearer ${token}`;
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

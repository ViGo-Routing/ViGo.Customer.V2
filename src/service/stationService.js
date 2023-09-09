import apiManager from "../utils/apiManager";

export const getStation = async (requestData) => {
  try {
    const response = await apiManager.get("/api/Station", requestData);
    console.log("getStation response:", response);
    return response;
  } catch (error) {
    console.error("Get List Station failed:", error);
  }
};

import apiManager from "../utils/apiManager";

export const createReport = async (
  requestData
) => {
  try {

    const response = await apiManager.post(`api/Report`, requestData);

    return response.data;
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

export const getReports = async (pageNumber = 1, pageSize = 10) => {
  const response = await apiManager.get(
    `api/Report/User?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );

  return response.data;
};

export const getReport = async (reportId) => {
  const response = await apiManager.get(`api/Report/${reportId}`);

  return response.data;
};

import apiManager from "../utils/apiManager";

export const createRoutine = async requestData => {
    try {
        const response = await apiManager.post('/api/RouteRoutine', requestData);
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
}
export const checkRoutine = async (requestData) => {
    console.log("requestData", requestData)
    try {
        const response = await apiManager.post('/api/RouteRoutine/Validate', requestData);
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
}

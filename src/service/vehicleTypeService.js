import apiManager from "../utils/apiManager";

export const getVehicleTypeById = async (id) => {
    try {

        const response = await apiManager.get(`/api/VehicleType/${id}`);
        return response;

    } catch (error) {
        console.error('Get VehicleType By  Id failed:', error);
    }
}
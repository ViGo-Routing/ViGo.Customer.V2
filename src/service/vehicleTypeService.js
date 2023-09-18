import apiManager from "../utils/apiManager";

export const getVehicleTypeById = async (id) => {
  try {
    const response = await apiManager.get(`/api/VehicleType/${id}`);
    return response;
  } catch (error) {
    console.error("Get VehicleType By  Id failed:", error);
  }
};

export const bikeVehicleTypeId = "2788f072-56cd-4fa6-a51a-79e6f473bf9f";

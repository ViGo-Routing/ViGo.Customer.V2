import apiManager from "../utils/apiManager";

export const getVehicleFare = async (vehicleTypeId: string) => {
  const response = await apiManager.get(
    `api/Fare/VehicleType/${vehicleTypeId}`
  );

  return response.data;
};

export const getFarePolicies = async (fareId: string) => {
  const response = await apiManager.get(`api/FarePolicy/Fare/${fareId}`);

  return response.data;
};

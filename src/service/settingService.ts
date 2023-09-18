import apiManager from "../utils/apiManager";

export const getSettings = async () => {
  const response = await apiManager.get(`api/Setting/`);

  return response.data;
};

export const settingKeys = {
  NightTripExtraFeeBike: "NightTripExtraFeeBike",
  TwoWeeklyTicketsDiscount: "2WeeklyTicketsDiscount",
  FiveWeeklyTicketsDiscount: "5WeeklyTicketsDiscount",
  TwoMonthlyTicketsDiscount: "2MonthlyTicketsDiscount",
  FourMonthlyTicketsDiscount: "4MonthlyTicketsDiscount",
  SixMonthlyTicketsDiscount: "6MonthlyTicketsDiscount",
};

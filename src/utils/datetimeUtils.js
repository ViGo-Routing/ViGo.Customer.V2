import Moment from "moment";

export const toVnDateTimeString = (datetime) => {
  return Moment(datetime).format("hh:mm - DD/MM/YYYY");
};
export const toVnDateString = (datetime) => {
  return Moment(datetime).format("DD-MM-YYYY");
};
export const toVnTimeString = (datetime) => {
  return moment(datetime, "HH:mm:ss").format("HH:mm");
};
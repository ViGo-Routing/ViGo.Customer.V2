export const vndFormat = (balance) => {
  if (balance) {
    return balance.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "đ";
  }
  return 0;
};

export const toPercent = (number, round) => {
  return `${(number * 100).toFixed(round ?? 2)}%`;
};

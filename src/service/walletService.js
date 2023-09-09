import apiManager from "../utils/apiManager";

export const getWalletByUserId = async (id) => {
  // try {
  const response = await apiManager.get(`/api/Wallet/User/${id}`);

  // console.log("Wallet\n");
  // console.log(response);
  return response.data;
  // } catch (error) {
  //   if (error.response && error.response.data) {
  //     // Assuming the error response has a 'data' property containing error details
  //     const errorDetails = error.response.data;
  //     console.log("errorDetails", errorDetails);
  //     return null;
  //   } else {
  //     console.log("Error response structure not recognized.");
  //     return null;
  //   }
  // }
};

export const getWalletTransactions = async (walletId, pageSize, pageNumber) => {
  try {
    const response = await apiManager.get(
      `api/WalletTransaction/Wallet/${walletId}
      ?pageNumber=${pageNumber}&pageSize=${pageSize}
      &orderBy=createdTime desc`
    );
    // console.log(response);
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

export const getWalletTransactionDetail = async (walletTransactionId) => {
  try {
    const response = await apiManager.get(
      `api/WalletTransaction/${walletTransactionId}`
    );
    console.log(response.data);
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

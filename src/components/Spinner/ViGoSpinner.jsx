import { memo } from "react";
import Spinner from "react-native-loading-spinner-overlay";

const ViGoSpinner = ({ isLoading }) => {
  return <Spinner visible={isLoading} />;
};

export default memo(ViGoSpinner);

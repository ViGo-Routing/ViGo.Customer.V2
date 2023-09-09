// import React from 'react';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

// const AutoCompelete = () => {
//   return (
//     <GooglePlacesAutocomplete
//       placeholder='Search'
//       onPress={(data, details = null) => {
//         // 'details' is provided when fetchDetails = true
//         console.log(data, details);
//       }}
//       styles={
//         {
//           container: {
//             flex: 0,
//           },
//           textInput: {
//             fontSize: 18,
//           }
//         }}
//       onPress={(data, details = null) => {
//         console.log(data);
//         console.log(details);
//       }}
//       returnKeyType={"search"}
//       fetchDetails={true}
//       return
//       minLength={2}
//       enablePoweredByContainer={false}
//       query={{
//         key: 'AIzaSyCIYCycKF24mQXN1pJYFfCO-6azSETj_Qc',
//         language: 'vn',
//       }}
//       nearbyPlacesAPI='GooglePlacesSearch'
//       debounce={400}
//     />
//   );
// };

// export default AutoCompelete;
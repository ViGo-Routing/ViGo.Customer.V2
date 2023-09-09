import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import Header from '../../components/Header/Header.jsx';
import CalendarCard from '../../components/Calender/CalenderCard.jsx';
import { themeColors } from '../../assets/theme/index.jsx';
import InputCard from '../../components/Card/InputCard.jsx';
import TimeCard from '../../components/Card/TimeCard.jsx';
import SelectDailyRoute from '../../components/Card/SelectDailyRoute.jsx';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createFareCalculate } from '../../service/bookingService.jsx';

const BikeSettingSchedule = () => {

  const navigation = useNavigation();
  const route = useRoute();
  // const { sendData } = route.params;
  // const data = { key: sendData };
  // console.log("response", sendData)
  const handleFareCalculate = (response) => {

    const requestData = {
      vehicleTypeId: "2788f072-56cd-4fa6-a51a-79e6f473bf9f",
      beginTime: "string",
      duration: 0,
      distance: 0,
      totalNumberOfTickets: 0,
      routineType: "RANDOMLY"
    }
    response = createFareCalculate(requestData)
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="Đặt lịch" />
      </View>
      <ScrollView style={styles.body}>
        <View style={styles.card}>
          <InputCard />
        </View>
        {/* <View style={styles.calen}>
            <CalendarCard />
          </View> */}
        <View style={styles.row}>
          <TimeCard title="Thời gian đón" />
          {/* <SelectBox
            options={['Option 1', 'Option 2', 'Option 3']}
            onValueChange={(value) => console.log(value)}
          /> */}
        </View>
        <View style={styles.sdr}>
          <SelectDailyRoute />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BookingDetail')}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  row: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: themeColors.linear,
  },
  calen: {
    padding: 20,
  },
  card: {
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#fff',
  },
  sdr: {
    padding: 10
  },
  button: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: themeColors.primary,
    alignItems: "center",
  },
  footer: {
    padding: 10,
  },
});

export default BikeSettingSchedule;
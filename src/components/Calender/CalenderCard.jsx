import { StyleSheet } from 'react-native';
import React, {useState} from 'react';
import {Calendar} from 'react-native-calendars';

const CalendarCard = () => {
  const [selected, setSelected] = useState('');

  return (
    <Calendar style={styles.card}
      onDayPress={day => {
        setSelected(day.dateString);
      }}
      markedDates={{
        [selected]: {
          selected: true,
          disableTouchEvent: true,
          selectedDotColor: 'orange',
        },
      }}
    />
  );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default CalendarCard;
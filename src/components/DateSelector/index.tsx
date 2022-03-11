import React, { useState }  from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// // JST基準に変換して返す
// const parseAsMoment = (dateTimeStr) => {
//   return moment.utc(dateTimeStr, 'YYYY-MM-DDTHH:mm:00Z', 'ja').utcOffset(9)
// }

interface Props {
  timestamp: Date;
  setTimestamp: React.Dispatch<React.SetStateAction<Date>>;
};

const DateSelector: React.FC<Props> = ({
  timestamp,
  setTimestamp,
}) => {
  const initialDate = new Date();
  const handleChange = (date: any) => {
    setTimestamp(date)
  }

  return (
    <DatePicker
      locale="ja"
      selected={timestamp}
      onChange={handleChange}
      dateFormat="yyyy/MM/dd"
    />
  );
}

export default DateSelector;

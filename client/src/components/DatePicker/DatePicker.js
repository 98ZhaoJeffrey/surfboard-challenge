import React, { HTMLAttributes } from 'react';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';

const DatePicker = ({
  selectedDate,
  onChange,
  isClearable = false,
  showPopperArrow = false,
  props
}) => {
  return (
    <ReactDatePicker
      selected={selectedDate}
      onChange={onChange}
      isClearable={isClearable}
      showPopperArrow={showPopperArrow}
      timeInputLabel="Start time:"
      dateFormat="MM/dd/yyyy h:mm aa"
      showTimeInput
      {...props}
    />
  );
};

export default DatePicker;
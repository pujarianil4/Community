import React from "react";
import type { DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import type { GetProps } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
dayjs.extend(customParseFormat);
export default function CDatePicker() {
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const dateFormat = "DD/MM/YYYY";

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current > dayjs().endOf("day");
  };
  return (
    <>
      <DatePicker
        defaultValue={dayjs().startOf("day")} // Sets today's date as the default value
        format={dateFormat}
        className='custom_datepicker'
        onChange={onChange}
        disabledDate={disabledDate}
      />
    </>
  );
}

// RangePickerComponent.jsx
"use client";

import React from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "./index.scss";
const { RangePicker } = DatePicker;

interface IRangePickerProps {
  value: [Dayjs | null, Dayjs | null];
  onChange: (value: [Dayjs | null, Dayjs | null] | null) => void;
  disabledDate?: (current: Dayjs | null) => boolean;
  allowClear?: boolean;
  className?: string;
}

const CustomRangePicker: React.FC<IRangePickerProps> = ({
  value,
  onChange,
  disabledDate,
  allowClear = true,
  className = "p-range-picker",
}) => {
  return (
    <RangePicker
      onChange={onChange}
      value={
        value.map((date) => (date ? dayjs(date) : null)) as [
          Dayjs | null,
          Dayjs | null
        ]
      }
      allowClear={allowClear}
      disabledDate={disabledDate}
      className={className}
      showTime
      format='YYYY-MM-DD HH:mm'
    />
  );
};

export default CustomRangePicker;

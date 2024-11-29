"use client";
import React from "react";
import "./tpost.scss";
import CInput from "@components/common/Input";
import CFilter from "@components/common/Filter";
import CDatePicker from "@/components/common/DatePicker";
export default function TPost() {
  return (
    <div className='tpost_container'>
      <div className='searchings'>
        <CInput placeholder='Search for Post' />

        <CDatePicker />
        <div>
          <CFilter
            list={[
              {
                value: "New",
                title: "Newest first",
              },
              {
                value: "New",
                title: "Oldest first",
              },
            ]}
            callBack={() => {}}
            defaultListIndex={0}
          />
        </div>
      </div>
    </div>
  );
}

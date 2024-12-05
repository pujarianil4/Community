"use client";
import React from "react";
import "./muted.scss";
import CInput from "@components/common/Input";
import CFilter from "@components/common/Filter";
import CDatePicker from "@/components/common/DatePicker";
export default function TComment() {
  return (
    <div className='tcomment_container'>
      <div className='searchings'>
        <CInput placeholder='Search for Comments' />

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

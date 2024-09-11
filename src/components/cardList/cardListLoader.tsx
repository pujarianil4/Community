import React from "react";

export default function CardListLoader() {
  return (
    <div className='card_container card_list_Loader'>
      <div className='photo_section skeleton'></div>
      <div className='content'>
        <div className='username skeleton'></div>
        <div className='info skeleton'></div>
        <div className='action skeleton'></div>
      </div>
    </div>
  );
}

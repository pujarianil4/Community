import React from "react";

export default function ProposalItemLoader() {
  return (
    // <section className='proposal_Item proposal_item_loader'>
    //   <div className='user_head skeleton'></div>
    //   <div className='proposal_data skeleton'></div>
    // </section>

    <section className='proposal_Item proposal_item_loader'>
      <div className='user_head'>
        <div className='skeleton user_avatar'> </div>
        <div className='names'>
          <div className='skeleton user_name'> </div>
          <div className='skeleton community_name'> </div>
        </div>
        <p className='post_time skeleton'></p>

        <div className='more'>
          <div className=' skeleton options '></div>
        </div>
      </div>

      <div className='proposal_data skeleton'>
        {/* <div className='content skeleton'></div> */}
      </div>
    </section>
  );
}

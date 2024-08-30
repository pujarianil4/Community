import { getRandomImageLink } from "@/utils/helpers";
import React from "react";
import "./index.scss";
import { DropdownUpIcon, MessageIcon } from "@/assets/icons";

export default function Post() {
  return (
    // <div className='post'>
    //   <div className='container'>
    //     <div>
    //       <div className='header'>
    //         <img src={getRandomImageLink()} alt='post' />
    //         <div>
    //           <span className='username'>@username</span>
    //           <span className='community'>community</span>
    //         </div>
    //       </div>
    //       <div className='content'>
    //         <p>
    //           Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
    //           magnam quam iusto quibusdam. Commodi accusamus error eum, enim
    //           reiciendis laudantium suscipit voluptatem quidem ut deserunt fugit
    //           ipsa iste vitae corrupti!
    //         </p>
    //       </div>
    //     </div>
    //     <div className='postmedia'>
    //       <img src={getRandomImageLink()} alt='post' />
    //     </div>
    //   </div>
    // </div>
    <div className='post_heading'>
      <div className='post_bx'>
        <img src='https://testcommunity.s3.amazonaws.com/0125f211-bf33-4610-8e73-6fc864787743-metamaskicon.png' />
        <span className='username'> anilpujari</span>
        <span className='community'> anilpujaricommunity</span>
      </div>
      <div className='post_content_bx'>
        <div className='post_inn_bx'>
          <img src='https://testcommunity.s3.amazonaws.com/0125f211-bf33-4610-8e73-6fc864787743-metamaskicon.png' />
        </div>
        <div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam magni
            dhjdashdajsda doloribus volup werrrewwerer
          </p>
          <div className='post_comment'>
            <span>
              <DropdownUpIcon width={12} height={12} /> 625
            </span>
            <span>
              <MessageIcon width={15} height={15} /> 65 Comments
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

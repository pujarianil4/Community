import { getRandomImageLink } from "@/utils/helpers";
import React from "react";
import "./index.scss";

export default function Post() {
  return (
    <div className='post'>
      <div className='container'>
        <div>
          <div className='header'>
            <img src={getRandomImageLink()} alt='post' />
            <div>
              <span className='username'>@username</span>
              <span className='community'>community</span>
            </div>
          </div>
          <div className='content'>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
              magnam quam iusto quibusdam. Commodi accusamus error eum, enim
              reiciendis laudantium suscipit voluptatem quidem ut deserunt fugit
              ipsa iste vitae corrupti!
            </p>
          </div>
        </div>
        <div className='postmedia'>
          <img src={getRandomImageLink()} alt='post' />
        </div>
      </div>
    </div>
  );
}

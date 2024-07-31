import CButton from "@/components/common/Button";
import { FiUpload } from "react-icons/fi";

import React from "react";
import "./index.scss";
import Image from "next/image";
export default function Profile() {
  return (
    <div className='profile_container'>
      <div className='avatar'>
        {/* <span className='label'>Avatar</span> */}

        <Image
          width={100}
          height={100}
          src='https://picsum.photos/200/300'
          alt='Avatar'
        />
        <div className='upload'>
          <FiUpload size={20} />
        </div>
      </div>
      <div className='info'>
        <span className='label'>Name</span>
        <input type='text' value='Anil Pujari' />
      </div>
      <div className='info'>
        <span className='label'>UserName</span>
        <input type='text' value='Anil Pujari' />
      </div>

      <div className='info'>
        <span className='label'>Description</span>
        <textarea
          rows={5}
          cols={10}
          value=' Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum quo nisi repudiandae laboriosam dolor. Incidunt amet laudantium asperiores illo officiis! Voluptate aperiam error omnis explicabo voluptates, nostrum repellat fugit accusamus!'
        />
      </div>
      <div className='btns'>
        <CButton> Save </CButton>
      </div>
    </div>
  );
}

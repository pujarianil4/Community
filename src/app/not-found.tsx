import { NotFound } from "@/assets/icons";
import Link from "next/link";
import React from "react";

export default function Notfound() {
  return (
    <div className='notfound-page'>
      <NotFound />
      <span>uh-oh! Nothing here...</span>
      <Link href={`/`} as={`/`}>
        {" "}
        <button>Back to Home</button>
      </Link>
    </div>
  );
}
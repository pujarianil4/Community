import { NotFound } from "@/assets/icons";
import Link from "next/link";
import React from "react";

export default function Notfound() {
  return (
    <div className='notfound_page'>
      <NotFound />
      <p>uh-oh! Nothing here...</p>
      <Link href={`/`} as={`/`}>
        {" "}
        <button>Back to Home</button>
      </Link>
    </div>
  );
}

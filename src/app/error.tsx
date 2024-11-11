"use client";
import React from "react";
import { PageError } from "@/assets/icons";
import Link from "next/link";

export default function Error({ error }: { error: Error }) {
  // export default function ErrorBoundary({ error }: { error: Error }) {
  console.log("statusCode", error);
  return (
    <div className='error_page'>
      <PageError />
      <p>{error?.message || "Something Went Wrong"}</p>
      <Link href={`/`} as={`/`}>
        <button>Back to Home</button>
      </Link>
    </div>
  );
}

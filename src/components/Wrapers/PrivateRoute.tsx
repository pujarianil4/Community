// components/PrivateRoute.tsx
"use client";
import React from "react";

import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";

// Define the HOC function with proper types
function PrivateRoute<P extends React.JSX.IntrinsicAttributes>(
  Component: React.FC<P>
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    const cookies = parseCookies();
    const token = cookies["authToken"];

    const router = useRouter();
    if (!token) {
      router.push("/");
      return <></>;
    }
    return <Component {...props} />;
  };

  return WrappedComponent;
}

export default PrivateRoute;

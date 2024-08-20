// components/PrivateRoute.tsx
"use client";
import React from "react";

import { useRouter } from "next/navigation";
import { getClientSideCookie } from "@/utils/helpers";

// Define the HOC function with proper types
function PrivateRoute<P extends React.JSX.IntrinsicAttributes>(
  Component: React.FC<P>
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    const token = getClientSideCookie("authToken");

    const router = useRouter();
    if (!token?.token) {
      router.push("/");
      return <></>;
    }
    return <Component {...props} />;
  };

  return WrappedComponent;
}

export default PrivateRoute;

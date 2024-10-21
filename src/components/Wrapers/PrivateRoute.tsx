// components/PrivateRoute.tsx
"use client";
import React from "react";

import { useRouter } from "next/navigation";
import { getClientSideCookie } from "@/utils/helpers";
import { getTokens } from "@/services/api/api";

// Define the HOC function with proper types
function PrivateRoute<P extends React.JSX.IntrinsicAttributes>(
  Component: React.FC<P>
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    const { token } = getTokens();

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

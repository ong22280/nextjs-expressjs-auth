"use client";

import { useAppSelector } from "@/libs/hooks/redux-hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);

  useEffect(() => {
    if (!basicUserInfo) {
      router.push("/auth");
    }
    setLoading(false);
  }, [basicUserInfo]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
};

export default AuthLayout;

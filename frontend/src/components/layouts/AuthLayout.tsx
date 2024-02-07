"use client";

import { useAppSelector } from "@/hooks/redux-hooks";
import { authSelector } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const userInfo = useAppSelector(authSelector);

  useEffect(() => {
    if (!userInfo.token) {
      router.push("/login");
    }
    setLoading(false);
  }, [userInfo.token, router]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
};

export default AuthLayout;

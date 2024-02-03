"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../libs/hooks/redux-hooks";
import { getUser, logout } from "../../../slices/authSlice";
import { useRouter } from "next/navigation";

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useRouter();

  const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);
  const userProfileInfo = useAppSelector((state) => state.auth.userProfileData);

  useEffect(() => {
    if (basicUserInfo) {
      dispatch(getUser(basicUserInfo.id));
    }
  }, [basicUserInfo, dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate.push("/login");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <h1>Home</h1>
      <h4>Name: {userProfileInfo?.name}</h4>
      <h4>Email: {userProfileInfo?.email}</h4>
      <button className="py-2 px-4 bg-red-500 text-white rounded-md"
      onClick={handleLogout}>Logout</button>
    </>
  );
};

export default Home;

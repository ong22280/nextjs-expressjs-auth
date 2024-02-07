"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux-hooks";
import { authSelector, logout } from "../../../store/slices/authSlice";
import { useRouter } from "next/navigation";
import { showNotification } from "@/store/slices/notificationSlice";
import { NotificationType } from "@/types/notificationType";

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useRouter();

  const authReducer = useAppSelector(authSelector);

  const handleLogout = async () => {
    try {
      const actionResult = await dispatch(logout()).unwrap();
      if (logout.fulfilled.match(actionResult)) {
        return navigate.push("/login");
      } else if (logout.rejected.match(actionResult)) {
        dispatch(
          showNotification({
            message: "Failed to logout",
            type: NotificationType.Error,
          })
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* Display authentication status */}
      <div>
        {authReducer.status === "loading" && <p>Loading...</p>}
        {authReducer.status === "failed" && <p>Error: {authReducer.error}</p>}
      </div>
      <h1>Home</h1>
      <h4>Name: {authReducer?.userInfo?.name}</h4>
      <h4>Email: {authReducer?.userInfo?.email}</h4>
      <button
        className="py-2 px-4 bg-red-500 text-white rounded-md"
        onClick={handleLogout}
      >
        Logout
      </button>
    </>
  );
};

export default Home;

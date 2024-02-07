"use client";

import { useAppSelector } from "../hooks/redux-hooks";
import { hideNotification } from "../store/slices/notificationSlice";
import { useAppDispatch } from "../hooks/redux-hooks";
import React from "react";

const NotificationBar = () => {
  const dispatch = useAppDispatch();
  const { open, message, type } = useAppSelector((state) => state.notification);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(hideNotification());
  };

  return (
    <div className="w-full">
      <div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${
          open ? "block" : "hidden"
        }`}
      >
        <div
          className={`w-full max-w-sm mx-auto bg-${type}-500 text-white rounded-lg shadow-lg pointer-events-auto`}
        >
          <div className="flex items-center justify-between px-4 py-2">
            <p className="font-semibold">{message}</p>
            <button className="text-white" onClick={handleClose}>
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.293 2.293a1 1 0 011.414 0L10 8.586l6.293-6.293a1 1 0 111.414 1.414L11.414 10l6.293 6.293a1 1 0 11-1.414 1.414L10 11.414l-6.293 6.293a1 1 0 01-1.414-1.414L8.586 10 2.293 3.707a1 1 0 010-1.414z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;

"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { authSelector, getUser, login } from "../../store/slices/authSlice";
import { showNotification } from "../../store/slices/notificationSlice";
import Link from "next/link";
import { NotificationType } from "@/types/notificationType";
import { useRouter } from "next/navigation";

const Login = () => {
  const dispatch = useAppDispatch();
  const authReducer = useAppSelector(authSelector);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    // This is only a basic validation of inputs. Improve this as needed.
    if (email && password) {
      const actionResult = await dispatch(login({ email, password }));
      if (login.fulfilled.match(actionResult)) {
        await dispatch(getUser());
        dispatch(
          showNotification({
            message: "Logged in successfully",
            type: NotificationType.Success,
          })
        );
        router.push("/home");
      } else if (login.rejected.match(actionResult)) {
        dispatch(
          showNotification({
            message: "Invalid email or password",
            type: NotificationType.Error,
          })
        );
      }
    } else {
      dispatch(
        showNotification({
          message: "Please provide email and password",
          type: NotificationType.Error,
        })
      );
    }
  };

  return (
    <>
      <div className="max-w-xs mx-auto mt-20">
        {/* Display authentication status */}
        <div>
          {authReducer.status === "loading" && <p>Loading...</p>}
          {authReducer.status === "failed" && <p>Error: {authReducer.error}</p>}
        </div>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <h1 className="text-center text-xl font-bold text-black">Login</h1>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleLogin}
            >
              Login
            </button>
            <Link
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="/register"
            >
              Don&apos;t have an account? Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

import Link from "next/link";
import React from "react";

type Props = {};

const Home = (props: Props) => {
  return (
    <>
      <div>Home</div>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
    </>
  );
};

export default Home;

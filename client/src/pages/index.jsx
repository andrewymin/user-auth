import React, { useEffect } from "react";
import Button from "../components/button";
import { useAuth } from "../context/AuthContext";
import TopNav from "../components/topNav";

export default function Home() {
  const { state, logout, authCheck } = useAuth();
  // useEffect(() => {
  //   authCheck();
  // }, [state.isAuthorized]);
  // console.log("do I log twice?");
  // const isAuthorized = false;

  return (
    <div className="App">
      <TopNav />
      <h1>Welcome!</h1>
      <h2>Login to see the secret or enjoy the home page</h2>
    </div>
  );

  // return (
  //   <div className="App">
  //     {!state.isAuthorized ? (
  //       <>
  //         <h1>Welcome!</h1>
  //         <h2>Login to see the secret or enjoy the home page</h2>
  //         <Button name="login" />
  //         <Button name="register" />
  //       </>
  //     ) : (
  //       <>
  //         <h1>Welcome {state.isAuthorized}</h1>
  //         <Button name="secret" />
  //         <button onClick={logout}>Logout</button>
  //       </>
  //     )}
  //   </div>
  // );
}

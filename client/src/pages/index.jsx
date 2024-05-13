import React, { useEffect } from "react";
import Button from "../components/button";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { state, logout, authCheck } = useAuth();
  useEffect(() => {
    authCheck();
  }, []);

  // const isUser = false;

  return (
    <div className="App">
      {!state.isUser ? (
        <>
          <h1>Welcome!</h1>
          <h2>Login to see the secret or enjoy the home page</h2>
          <Button name="login" />
          <Button name="register" />
        </>
      ) : (
        <>
          <h1>Welcome {state.isUser}</h1>
          <Button name="secret" />
          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
}

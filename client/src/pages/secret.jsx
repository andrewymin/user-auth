import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import TopNav from "../components/topNav";

function Secret(props) {
  const { authCheck } = useAuth();

  // useEffect(() => {
  //   // 4/29 commented for testing
  //   authCheck();
  // }, []);

  return (
    <div className="secret">
      <TopNav />
      <div>
        <h1>The secrets page</h1>
        <h2>Logged in to see this</h2>
        <p>😁🎊🎉🎇</p>
      </div>
    </div>
  );
}

export default Secret;

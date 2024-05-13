import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function GeneralSettings(props) {
  const { state, userDataFetch } = useAuth();

  userDataFetch();

  const titleHeading = {
    position: "absolute",
    marginTop: "5rem",
    top: "7px",
    left: 0,
  };

  return (
    <>
      <h2 style={titleHeading}>Account Details: </h2>
      <div className="userData">
        <h3>EMAIL: </h3>
        <p>{state.user.email}</p>
        <h3>GOOGLE LINKED: </h3>
        <p>{state.user.googleLink}</p>
      </div>
    </>
  );
}

export default GeneralSettings;

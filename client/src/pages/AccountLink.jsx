import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function accountLink(props) {
  const { acId, acTk } = useParams();
  const { linkGoogleAccount } = useAuth();
  const navigate = useNavigate();
  console.log(acId, acTk);

  const googleLink = () => linkGoogleAccount(gId, gTk);
  const loginRedirect = () => navigate("/login");

  return (
    <section>
      <div>
        <h2>User with this email already exists.</h2>
        <p>Would you like to link these accounts?</p>
        <div>
          <button onClick={googleLink} type="button">
            Link
          </button>
          <button onClick={loginRedirect} type="button">
            Re-Log
          </button>
        </div>
        <p>Re-Log will redirect to login page to login with other method</p>
      </div>
    </section>
  );
}

export default accountLink;

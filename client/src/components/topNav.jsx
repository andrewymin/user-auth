import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function TopNav(props) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  var modalBtn = document.querySelector(".acct");
  var modal = document.querySelector(".acct-modal > ul");

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (!isOpen) return;
    if (event.target != modal && event.target != modalBtn) setIsOpen(!isOpen);
  };

  const account = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav>
      <Link className="homeLink" to={"/"}>
        Home
      </Link>

      <div className="userOpt">
        <button onClick={logout}>logout</button>
        <button
          className="acct"
          style={{ backgroundColor: "transparent" }}
          onClick={account}
        >
          🍔
        </button>
      </div>
      <div className={`acct-modal ${isOpen ? "open" : "close"}`}>
        <ul>
          <li>
            <Link to={"/dashboard/general"}>Profile</Link>
          </li>
          <li>
            <Link to={"/dashboard/security"}>Settings</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default TopNav;

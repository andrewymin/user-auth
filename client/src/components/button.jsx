import React from "react";
import { Link } from "react-router-dom";

export default function Buttons(props) {
  return (
    <Link to={`/${props.name}`}>
      <button>{props.name ? props.name : "Logout"}</button>
    </Link>
  );
}

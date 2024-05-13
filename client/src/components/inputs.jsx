import React from "react";

function Inputs(props) {
  return (
    <input
      name={props.name}
      className={props.name}
      onChange={props.change}
      type={props.inputType}
      placeholder={props.ph}
      minLength={props.lengthMin}
      required={true}
      autoComplete="off"
    />
  );
}

export default Inputs;

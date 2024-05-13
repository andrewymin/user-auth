import axios from "axios";
import React, { useState, useRef } from "react";
import Input from "../components/inputs";
import { useNavigate } from "react-router-dom";
// import Buttons from "../components/button";
import { useAuth } from "../context/AuthContext";
import useToast from "../components/notifications";
import { ToastContainer } from "react-toastify";

function Register(props) {
  const { register, dispatch } = useAuth();
  const navigate = useNavigate();
  const { showError } = useToast();
  // using properties of state instead of actual state values do to delay
  //  from asyncronous updating
  const [state, setState] = useState({
    password: "",
    confirmPassword: "",
  });

  // Replace with link
  function goHome() {
    navigate("/");
  }

  function loginPG() {
    navigate("/login");
  }

  // const handleSubmit = (e) => {
  //   register();
  //   e.preventDefault();
  // };

  // const handleSubmit = (e) => {
  //   axios
  //     .post("http://localhost:5000/api/user/signup", {
  //       userID: email,
  //       userPass: pwd,
  //     })
  //     .then((res) => console.log(res));

  //   e.preventDefault();
  //   // console.log(email, pwd)
  // };

  const showPSW = () => {
    const eye = document.querySelector(".fa-eye");
    const eyeClose = document.querySelector(".fa-eye-slash");
    eyeClose?.classList.toggle("hide");
    eye?.classList.toggle("show");

    const psw = document.querySelectorAll(".pwd");
    psw.forEach((i) => {
      const type = i?.getAttribute("type") === "password" ? "text" : "password";
      i?.setAttribute("type", type);
    });
    // For single password reveal
    //   const psw = document.querySelector("#pwd");
    //   const type = psw?.getAttribute("type") === "password" ? "text" : "password";
    //   psw?.setAttribute("type", type);
  };

  // Using function to handle state property update for both pass inputs
  const handleChange = (e, n) => {
    setState({
      // merging previous state to new state object with the "..."
      ...state,
      [n]: e.target.value,
    });
  };

  const checkPassword = (e) => {
    e.preventDefault();
    if (state.password != state.confirmPassword)
      return showError("Passwords do not match!");
    else {
      register(e);
    }
  };

  return (
    <div className="inputContainer">
      <h2 className="homeBtn" onClick={goHome}>
        <i className="fas fa-caret-left"></i>
        <span>Home</span>
      </h2>

      <i className="fas fa-arrow-right-to-bracket fa-10x fa-bounce"></i>

      <form className="formInputs" onSubmit={checkPassword}>
        {/* <label htmlFor='userEmail'>UserName: </label>
            <Input inputType="text" name="user" ph="HappyUser01" change={(e)=> setUser(e.target.value)} charLength="0"/> */}
        <label htmlFor="userEmail">Email: </label>
        <Input
          inputType="email"
          name="email"
          ph="Example@email.com"
          change={(e) => dispatch({ type: "USER", payload: e.target.value })}
          charLength="0"
        />
        <label htmlFor="userPass">Password: </label>
        {/* this is for testing purposes */}
        {/* <Input inputType="password" name="userPass" ph="0123abc!#$" change={this.handleChange} charLength="12"/> */}
        {/* this is for testing purposes */}
        {/* <Input inputType="password" name="userPass" ph="0123abc!#$" change={(e: any)=> setPwd(e.target.value)} charLength="3"/> */}
        <div className="revealPsw">
          <Input
            inputType="password"
            name="pwd"
            ph="Password"
            change={(e) => handleChange(e, "password")}
            lengthMin="3"
          />
        </div>
        <label htmlFor="userPass">Confirm Password: </label>
        <div className="revealPsw">
          <Input
            inputType="password"
            name="pwd"
            ph="Confirm Password"
            change={(e) => {
              handleChange(e, "confirmPassword");
              // must place this here since it has the same delay if placed above with register()
              dispatch({ type: "PWD", payload: e.target.value });
            }}
            lengthMin="3"
          />
          <span onClick={showPSW}>
            <i className="fas fa-eye"></i>
          </span>
          <span onClick={showPSW}>
            <i className="fas fa-eye-slash"></i>
          </span>
        </div>
        <p>
          minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1,
          minSymbols: 1
        </p>
        <button type="button" onClick={loginPG}>
          Login
        </button>
        <button type="submit" id="registerBtn">
          Sign Up
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Register;

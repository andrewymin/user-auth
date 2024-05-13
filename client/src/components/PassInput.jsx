import React, { useState, useEffect } from "react";
import customAxios from "../components/axiosInstance";
import Input from "./inputs";
import { useNavigate, useParams } from "react-router-dom";
// import Buttons from "../components/button";
import { useAuth } from "../context/AuthContext";
import useToast from "./notifications";
import { ToastContainer } from "react-toastify";

function PassInput(props) {
  const { dispatch, state } = useAuth();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const { token } = useParams();

  useEffect(() => {
    // 4/29 commented for testing
    // userDataFetch();
  }, []);

  // using properties of state instead of actual state values do to delay
  //  from asyncronous updating
  const [passwordState, setPasswordState] = useState({
    password: "",
    confirmPassword: "",
  });

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
  };

  // Using function to handle state property update for both pass inputs
  const handleChange = (e, n) => {
    setPasswordState({
      // merging previous state to new state object with the "..."
      ...passwordState,
      [n]: e.target.value,
    });
  };

  const checkPassword = async (e) => {
    e.preventDefault();
    if (state.password != state.confirmPassword)
      return showError("Passwords do not match!");
    else {
      try {
        await customAxios
          .post("api/user/reset-password", {
            userPass: state.pwd,
            token: token,
          })
          .then((res) => {
            // console.log(res);
            showSuccess(res.data.msg);
            navigate(`/`);
          });
      } catch (error) {
        showError(error.response.data.msg);
        // console.log(error);
      }
    }
  };

  return (
    <>
      <form className="formInputs" onSubmit={checkPassword}>
        {/* <label htmlFor='userEmail'>UserName: </label>
            <Input inputType="text" name="user" ph="HappyUser01" change={(e)=> setUser(e.target.value)} charLength="0"/> */}
        <label htmlFor="userPass">New Password</label>
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
        <button type="submit" className="sc-grid">
          Send
        </button>
      </form>
      <ToastContainer />
    </>
  );
}

export default PassInput;

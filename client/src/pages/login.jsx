import Button from "../components/button";
import React, { useState, useEffect } from "react";
import Input from "../components/inputs";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import customAxios from "../components/axiosInstance";
import getGoogleUrl from "../oauth_Urls/getGoogleUrl";
import { getGithubUrl } from "../oauth_Urls/getGithubUrl";
import useToast from "../components/notifications";

function Login() {
  const { login, dispatch, state } = useAuth();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const { showError, showSuccess } = useToast();

  // const handleCallbackResponse = (response) => {
  //   console.log("Encoded JWT ID token: " + response.credential);
  // };

  // useEffect(() => {
  //   /* global google */
  //   google.accounts.id.initialize({
  //     client_id:
  //       "744105593710-mfc4crns0h4tcba5o51fack7u20m5pk8.apps.googleusercontent.com",
  //     callback: handleCallbackResponse,
  //   });

  //   google.accounts.id.renderButton(document.getElementById("signInDiv"), {
  //     theme: "outline",
  //     size: "large",
  //   });
  // }, []);

  function handleSubmit(e) {
    e.preventDefault();
    login();
  }

  const sendEmail = async (e) => {
    e.preventDefault();
    // showSuccess(`Sent link to: ${state.user}`);
    try {
      await customAxios
        .post("api/user/reset-password-link", {
          userID: state.user,
        })
        .then((res) => {
          // console.log(res);
          showSuccess(res.data.successMsg);
          setOpenModal(false);
        });
    } catch (error) {
      showError(error.response.data.errorMsg);
    }
  };

  // const handleSubmit = (e) => {
  //   console.log(state.user, state.pwd);
  //   e.preventDefault();
  // };

  const showPSW = () => {
    const eye = document.querySelector(".fa-eye");
    const eyeClose = document.querySelector(".fa-eye-slash");
    eyeClose?.classList.toggle("hide");
    eye?.classList.toggle("show");

    const psw = document.querySelector(".pwd");
    const type = psw?.getAttribute("type") === "password" ? "text" : "password";
    psw?.setAttribute("type", type);
  };

  const gh = () => {
    console.log("github auth");
  };

  const registerPage = () => {
    navigate("/register");
  };

  const resetModal = () => {
    setOpenModal(!openModal);
  };

  return (
    <div className="wrapper">
      <Link
        style={{ position: "absolute", left: "1.5rem", top: "1.5rem" }}
        to={"/"}
      >
        <button>Home</button>
      </Link>
      <section className="intro">
        <i className="fas fa-lock fa-10x fa-shake"></i>
        <h1>Locked Page</h1>
        <h2>Login to See Secrets</h2>
      </section>

      <div className="loginSection">
        <div className="authTypes">
          {/* <div className="gg" onClick={getGoogleUrl}>
            Google
          </div> */}
          <a className="gg" href={getGoogleUrl()}>
            Google
          </a>
          <a className="gh" href={getGithubUrl()}>
            Github
          </a>
        </div>
        <div className="inputContainer">
          <form className="formInputs" onSubmit={handleSubmit}>
            <label htmlFor="user">User ID </label>
            <Input
              inputType="email"
              name="user"
              ph="User ID"
              change={(e) =>
                dispatch({ type: "USER", payload: e.target.value })
              }
              lengthMin="0"
            />

            <label htmlFor="pwd">Password </label>
            <div className="revealPsw loginPass">
              <Input
                inputType="password"
                name="pwd"
                ph="Password"
                change={(e) =>
                  dispatch({ type: "PWD", payload: e.target.value })
                }
                lengthMin="3"
              />
              <span onClick={showPSW}>
                <i className="fas fa-eye"></i>
              </span>
              <span onClick={showPSW}>
                <i className="fas fa-eye-slash"></i>
              </span>
            </div>
            <button type="button" onClick={registerPage} className="mt1">
              Sign Up
            </button>
            <button type="submit" className="mt1">
              Login
            </button>
            <button type="button" onClick={resetModal}>
              Forgot Password?
            </button>
          </form>
        </div>
      </div>
      <div className={`bg-cover ${openModal ? "open" : "close"}`}></div>
      <div className={`${openModal ? "open" : "close"}`}>
        <div id="modal">
          <button type="button" onClick={resetModal}>
            ❌
          </button>
          <form onSubmit={sendEmail}>
            <label htmlFor="user">Email: </label>
            <Input
              inputType="email"
              name="user"
              ph="User ID"
              change={(e) =>
                dispatch({ type: "USER", payload: e.target.value })
              }
              lengthMin="0"
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;

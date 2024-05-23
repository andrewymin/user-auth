import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import customAxios from "../components/axiosInstance";
// import { notifyError } from "../components/notifications";
import { ToastContainer } from "react-toastify";
import useToast from "../components/notifications";

const VerificationCode = ({ length = 6 }) => {
  const navigate = useNavigate();
  const MAX_AGE = 180000; // in ms thus 3min
  const { accessVerificationPage } = useAuth();
  const { showError } = useToast();

  // Check if user is allowed to see this page, i.e. if they clicked sign-in or just tried to use url
  useEffect(() => {
    accessVerificationPage();
    // place setTimeout for max_age of token and useHistory from
    //  react-router-dom history.push('/') for the verify page
    //  to redirect to home
    const verifyPageTime = setTimeout(() => {
      navigate("/");
    }, MAX_AGE);

    return () => {
      clearTimeout(verifyPageTime);
    };
  }, [navigate]);

  // State to hold the code's values
  const [code, setCode] = useState(Array(length).fill(""));
  // References to input fields
  const inputsRef = useRef([]);

  const onComplete = async (userCode) => {
    // Send an axios call to server to check if mongo User code matches
    console.log(userCode);
    try {
      await customAxios
        .post("verification/verifyCode", {
          userCode: userCode,
        })
        .then((res) => {
          // dispatch({ type: "IS_AUTH", payload: res.data.isAuth });
          console.log(res.data.msg);
          // sending to home page since the cookie for auth will be created on B.E.
          navigate(`/`);
        });
    } catch (err) {
      // toastify will only work with toastContainer! don't forget
      showError(err.response.data);
      console.log(err.response.data);
    }
  };

  const requestCode = async (e) => {
    e.preventDefault();
    // console.log(state.user, state.pwd);
    try {
      await customAxios.post("verification/newCode").then((res) => {
        // dispatch({ type: "IS_AUTH", payload: res.data.isAuth });
        console.log(res.data.msg);
      });
    } catch (error) {
      // TODO: npm react-toastify and add notifications for errors
      showError(error.response.data.errorMsg);
    }
  };

  // Handle changes in the input fields
  const handleChange = (value, index) => {
    // Validate numeric input
    if (/^\d$/.test(value) || value === "") {
      // Update the code array with the new value
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // If input is not empty and there are more inputs, focus on the next input
      if (value && index < length - 1) {
        inputsRef.current[index + 1].focus();
      }

      // Check if the code is complete
      if (newCode.join("").length === length) {
        onComplete(newCode.join(""));
      }
    }
  };

  // Handle key down events
  const handleKeyDown = (e, index) => {
    // Move focus to the previous input if the backspace key is pressed and the current field is empty
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <section>
      <h1>Verification</h1>
      <h2>Enter the verification code to complete sign up</h2>
      <form className="verification-code">
        <div className="input-boxes">
          {code.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
              className="code-input"
            />
          ))}
        </div>
        <button onClick={requestCode}>Resend code</button>
      </form>
      <ToastContainer />
    </section>
  );
};

export default VerificationCode;

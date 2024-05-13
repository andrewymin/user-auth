import React from "react";
import customAxios from "./axiosInstance";
import useToast from "./notifications";

function SecuritySettings(props) {
  const { showError, showSuccess } = useToast();

  const resetPass = async (e) => {
    e.preventDefault();
    // console.log(state.user, state.pwd);
    try {
      await customAxios.post("api/user/reset-password-link").then((res) => {
        showSuccess("Password reset email sent");
      });
    } catch (error) {
      showError(error.response.data.errorMsg);
      // console.log(error.response.data.errorMsg);
    }
  };

  return (
    <>
      <button onClick={resetPass}>Reset Password</button>
    </>
  );
}

export default SecuritySettings;

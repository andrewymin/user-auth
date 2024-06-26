import React, { createContext, useContext, useReducer, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import customAxios from "../components/axiosInstance";
import useToast from "../components/notifications";
// import { notifyError } from "../components/notifications";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

const initialState = {
  user: "",
  pwd: "",
  isAuthorized: false,
  vPage: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "USER": {
      return { ...state, user: action.payload };
    }
    case "PWD": {
      return { ...state, pwd: action.payload };
    }
    case "IS_AUTH": {
      return { ...state, isAuthorized: action.payload };
    }
    case "ACCESS_V_PAGE": {
      return { ...state, vPage: action.payload };
    }
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const { showError } = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    // console.log(state.user, state.pwd);
    try {
      await customAxios
        .post("api/user/signup", {
          userID: state.user,
          userPass: state.pwd,
        })
        .then((res) => {
          // dispatch({ type: "ACCESS_V_PAGE", payload: true });
          console.log(res.data.msg);
          navigate(`/verify`);
        });
    } catch (error) {
      showError(error.response.data.errorMsg);
      // console.log(error.response.data.errorMsg);
    }
  };

  const login = async () => {
    try {
      await customAxios
        .post("api/user/login", {
          userID: state.user,
          userPass: state.pwd,
        })
        .then((res) => {
          dispatch({ type: "IS_AUTH", payload: res.data.authorized });
          // console.log(res.data.userData.email);
          // localStorage.setItem("user", JSON.stringify(user));
          navigate("/secret");
        });
    } catch (error) {
      showError(error.response.data.errorMsg);
      console.log(error.response.data.errorMsg);
    }
  };

  const logout = async () => {
    // console.log("working?");
    try {
      await customAxios.get("api/user/logout").then((res) => {
        dispatch({ type: "IS_AUTH", payload: res.data.authorized });
        // console.log(res.data.isAuthorized);
        // console.log(res.data.token);
        console.log("logout auth successful");
        navigate("/");
      });
    } catch (error) {
      console.log(error);
      // throw error;
    }
  };

  const userDataFetch = async () => {
    try {
      await customAxios.get("api/user/data").then((res) => {
        // console.log(res.data.userData);
        dispatch({ type: "USER", payload: res.data.userData });
      });
    } catch (error) {
      // notifyError(error.response.data.errorMsg);
      navigate("/");
    }
  };

  const authCheck = async () => {
    // console.log(state.user, state.pwd);
    try {
      await customAxios.get("auth/protected-route").then((res) => {
        // after checking cookie on server side if good, set IS_AUTH true
        dispatch({ type: "IS_AUTH", payload: res.data.authorized });
      });
    } catch (error) {
      // cookie was found not good/some error happened, set IS_AUTH false
      dispatch({ type: "IS_AUTH", payload: false });
    }
  };

  const accessVerificationPage = async () => {
    // console.log(state.user, state.pwd);
    try {
      await customAxios.get("verification/verifyPage").then((res) => {
        dispatch({ type: "ACCESS_V_PAGE", payload: res.data.accessPage.allow });
        // place setTimeout for max_age of token and useHistory from
        //  react-router-dom history.push('/target-page') for the verify page
        //  to redirect to previous page
      });
    } catch (error) {
      dispatch({ type: "ACCESS_V_PAGE", payload: false });
      console.log(error);
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        logout,
        login,
        register,
        authCheck,
        userDataFetch,
        accessVerificationPage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

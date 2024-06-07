import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Protected(props) {
  const { state } = useAuth();

  return state.isAuthorized ? <Outlet /> : <Navigate to="/" replace={true} />;
}

export default Protected;

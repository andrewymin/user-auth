import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import PassInput from "../components/PassInput";

function ResetPassPage(props) {
  const { authCheck } = useAuth();
  const { token } = useParams();

  useEffect(() => {
    // 4/29 commented for testing
    // authCheck();
  }, []);

  return (
    <div>
      <PassInput />
    </div>
  );
}

export default ResetPassPage;

import { Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import Index from "./pages/index";
import Register from "./pages/register";
import Login from "./pages/login";
import Secret from "./pages/secret";
// import AccountLink from "./pages/accountLink";
import VerificationCode from "./pages/verify";
import Dashboard from "./pages/Dashboard";
import ResetPassPage from "./pages/newPassword";
import Protected from "./components/Protected";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";

function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} exact />
      {/* <Route path="/google/callback" element={<Google />} /> */}
      {/* <Route path="/account-link/:acId/:acTk" element={<AccountLink />} /> */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Protected />}>
        <Route path="/secret" element={<Secret />} />
        <Route path="/verify" element={<VerificationCode />} />
        <Route path="/dashboard/:cat" element={<Dashboard />} />
        <Route path="/password-reset/:token" element={<ResetPassPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AllRoutes;

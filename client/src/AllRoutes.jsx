import { Routes, Route } from "react-router-dom";
import React from "react";
import Index from "./pages/index";
import Register from "./pages/register";
import Login from "./pages/login";
import Secret from "./pages/secret";
// import AccountLink from "./pages/accountLink";
import VerificationCode from "./pages/verify";
import Dashboard from "./pages/Dashboard";
import ResetPassPage from "./pages/newPassword";

function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      {/* <Route path="/google/callback" element={<Google />} /> */}
      {/* <Route path="/account-link/:acId/:acTk" element={<AccountLink />} /> */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<VerificationCode />} />
      <Route path="/secret" element={<Secret />} />
      <Route path="/dashboard/:cat" element={<Dashboard />} />
      <Route path="/password-reset/:token" element={<ResetPassPage />} />
    </Routes>
  );
}

export default AllRoutes;

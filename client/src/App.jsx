import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
// import AllRoutes from "./allRoutes";
import Index from "./pages/index";
import Register from "./pages/register";
import Login from "./pages/login";
import Secret from "./pages/secret";
// import AccountLink from "./pages/accountLink";
import VerificationCode from "./pages/verify";
import Dashboard from "./pages/Dashboard";
import ResetPassPage from "./pages/newPassword";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* <AllRoutes /> */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerificationCode />} />
          <Route path="/secret" element={<Secret />} />
          <Route path="/dashboard/:cat" element={<Dashboard />} />
          <Route path="/password-reset/:token" element={<ResetPassPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

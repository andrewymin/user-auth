import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AllRoutes from "./allRoutes";
///////// Uncomment if not using Allroutes component if its causing deployment problems
// import Index from "./pages/index";
// import Register from "./pages/register";
// import Login from "./pages/login";
// import Secret from "./pages/secret";
// import VerificationCode from "./pages/verify";
// import Dashboard from "./pages/Dashboard";
// import ResetPassPage from "./pages/newPassword";
// import NotFound from "./pages/NotFound";
// import Protected from "./components/Protected";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AllRoutes />
        {/* <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Protected />}>
            <Route path="/secret" element={<Secret />} />
            <Route path="/verify" element={<VerificationCode />} />
            <Route path="/dashboard/:cat" element={<Dashboard />} />
            <Route path="/password-reset/:token" element={<ResetPassPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes> */}
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

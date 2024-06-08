import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AllRoutes from "./AllRoutes";
import ThirdPartyCookieConsent from "./components/ThirdPartyCookieConsent";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AllRoutes />
        <ThirdPartyCookieConsent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

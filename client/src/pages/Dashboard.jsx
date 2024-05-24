import React, { useState, useEffect } from "react";
import GeneralSettings from "../components/generalSettings";
import SecuritySettings from "../components/securitySettings";
import { useNavigate, useParams } from "react-router-dom";
import TopNav from "../components/topNav";
import { useAuth } from "../context/AuthContext";
import useToast from "../components/notifications";
import { ToastContainer } from "react-toastify";

function Dashboard(props) {
  // either update this through useParams or use Authcontext state
  const { state, authCheck, userDataFetch } = useAuth();
  const { showError, showSuccess } = useToast();
  const { cat } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general"); // Track active tab
  // console.log(cat);

  useEffect(() => {
    // 4/29 commented for testing
    authCheck();
    userDataFetch();

    if (!cat) return navigate("/");
    setActiveTab(cat);
  }, [navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div id="settingsPage">
      <TopNav />
      {/* Render tabs or buttons to switch between settings */}
      <nav id="sidebar">
        <button onClick={() => handleTabChange("general")}>General</button>
        <button onClick={() => handleTabChange("security")}>Security</button>
      </nav>

      {/* Render the appropriate settings component */}
      <div className="userSettings">
        {activeTab === "general" && (
          <GeneralSettings
            email={state.user.email}
            googleLinked={state.user.googleLink}
            githubLinked={state.user.githubLinked}
          />
        )}
        {activeTab === "security" && <SecuritySettings />}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Dashboard;

import { useEffect, useState } from "react";

function ThirdPartyCookieConsent(props) {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    checkConsent();
  }, []);

  const checkConsent = () => {
    const consent = localStorage.getItem("third-party-cookie-consent");
    if (!consent) return;
    setIsVisible(false);
  };

  const handleConsent = () => {
    localStorage.setItem("third-party-cookie-consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-container">
      <div className="cookie-consent-message">
        <p>
          Our website uses third-party cookies for the login/signup system. You
          need to enable third-party cookies for these features to work
          properly.
        </p>
        <button onClick={handleConsent} className="consent-button">
          I Understand
        </button>
      </div>
    </div>
  );
}

export default ThirdPartyCookieConsent;

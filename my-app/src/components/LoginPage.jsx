import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

const LoginPage = ({ onLoginSuccess }) => {
  const clientId = "597400534990-f11ae8nugn9r5ose9rptclo53ttv2a59.apps.googleusercontent.com";

  const handleLogin = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("User Info:", decoded);

    localStorage.setItem("isLoggedIn", "true");
    onLoginSuccess();
  };

  const handleLoginFailure = () => {
    console.error("Google login failed");
  };

  return (
    <div className="login-container">
      <nav className="navbar">
        <div className="navbar-logo">Quantum Fin</div>
        <ul className="navbar-links">
          <li><a href="#about">About</a></li>
          <li><a href="#mission">Mission</a></li>
          <li><a href="#login">Login</a></li>
        </ul>
      </nav>

      <div className="about-section" id="about">
        <h1>About Quantum Fin</h1>
        <p>
          Quantum Fin is your AI-powered financial assistant, designed to help individuals and businesses make smart,
          data-driven decisions. Using cutting-edge Gen-AI technologies, Quantum Fin offers personalized financial
          insights, budget tracking, smart investment suggestions, and much more.
        </p>
      </div>

      <div className="objective-section" id="mission">
        <h2>Our Mission</h2>
        <p>
          We aim to democratize financial intelligence by making it accessible to everyone. With Quantum Fin, you
          don't just track your money — you understand it.
        </p>
      </div>

      <div className="login-intro">
        <h1>Welcome to Quantum Fin</h1>
        <p>AI-powered financial intelligence at your fingertips.</p>
      </div>

      <div className="login-box" id="login">
        <h2>Sign in to continue</h2>
        {clientId ? (
          <GoogleLogin clientId={clientId} onSuccess={handleLogin} onError={handleLoginFailure} />
        ) : (
          <p style={{ color: "red" }}>Google Client ID not found. Check your setup.</p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
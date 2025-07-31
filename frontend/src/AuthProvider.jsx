import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    // Check for the authToken cookie by sending a request to the backend
    axios
      .get("http://localhost:3000/api/validateToken", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
        console.log(response.data);
      })

      .catch((error) => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogin = (credentials) => {
    axios
      .post("http://localhost:3000/api/login", credentials, {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data.shop);
        console.log(user);
        navigate("/");
      })
      .catch((error) => {
        console.error("Login failed", error);
        setLoginError("Invalid email or password.");
      });
  };
  const handleGoogleLogin = async (
    googleResponse,
    { redirect = true } = {}
  ) => {
    try {
      const { credential } = googleResponse;
      // Send the token to your backend for validation
      const response = await axios.post(
        "http://localhost:3000/api/auth/google",
        { token: credential },
        { withCredentials: true }
      );
      console.log(response.data.user);
      setUser(response.data.user);
      if (redirect) {
        navigate("/");
      }
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  const handleLogout = () => {
    axios
      .post("http://localhost:3000/api/logout", {}, { withCredentials: true })
      .then(() => {
        setUser(null);
        navigate("/auth");
      })
      .catch((error) => {
        console.error("Logout failed", error);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginError,
        setUser,
        handleLogin,
        handleGoogleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

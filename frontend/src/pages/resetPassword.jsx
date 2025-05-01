import React, { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
  const [step, setStep] = useState("request"); // steps: request, verify, reset, done
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const requestCode = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await axios.post("http://localhost:3000/api/shop/request-reset", { email });
      setMessage("A verification code has been sent to your email.");
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.message || "Error sending reset code");
    }
  };

  // Step 2: Verify the code entered by the user
  const verifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await axios.post("http://localhost:3000/api/shop/verify-code", { email, code });
      setMessage("Code verified! Please enter your new password.");
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code.");
    }
  };

  // Step 3: Reset the password
  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await axios.post("http://localhost:3000/api/shop/reset-password", {
        email,
        newPassword,
      });
      setMessage("Your password has been successfully updated.");
      setStep("done");
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-[#f5f5f5] gap-y-4">
      <div className="w-[26%] flex flex-col gap-y-5 bg-white px-5 py-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Password Reset</h2>

        {message && <p className="mb-4 text-green-600">{message}</p>}
        {error && <p className="mb-4 text-red-600">{error}</p>}

        {step === "request" && (
          <form onSubmit={requestCode}>
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
              </label>
            </div>
            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
              type="submit"
            >
              Send Verification Code
            </button>
          </form>
        )}

        {step === "verify" && (
          <form onSubmit={verifyCode}>
            <div className="mb-4"> 
              <label className="block mb-2 font-medium">
                Verification Code:
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Verify Code
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={resetPassword}>
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                New Password:
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Reset Password
            </button>
          </form>
        )}

        {step === "done" && (
          <div>
            <p>
              Your password has been reset. You may now log in with your new
              password.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

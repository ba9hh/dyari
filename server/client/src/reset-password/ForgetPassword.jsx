import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import VerifyEmail from "./verifyEmail";
import RequestCode from "./RequestCode";
import ResetPassword from "./ResetPassword";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Dyari from "../components/Dyari";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep((prev) => prev + 1);
  };
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-[#f5f5f5] gap-y-4">
      <Dyari />
      <div className="w-[26%] flex flex-col gap-y-5 bg-white px-5 py-8 rounded-md shadow-md">
        <Typography variant="h5" align="center" gutterBottom>
          Password Reset
        </Typography>

        {currentStep === 1 && <RequestCode onDone={nextStep} setEmail={setEmail}/>}
        {currentStep === 2 && <VerifyEmail onDone={nextStep} email={email}/>}
        {currentStep === 3 && <ResetPassword onDone={nextStep} email={email}/>}
        {currentStep === 4 && (
          <div className="flex flex-col items-center gap-y-2">
            <CheckCircleIcon
            className="text-green-500"
            style={{ fontSize: 40 }}
          />
            <p>
              Your password has been reset. You may now log in with your new
              password.
            </p>
            <Link className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200" to={"/auth/vendor/login"}> 
              back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;

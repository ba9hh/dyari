import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

const VerifyEmail = ({ onDone, formData }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = React.useRef([]);
  const handleInput = (e, index) => {
    setErrorMessage("");
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handlePaste = (e) => {
    setErrorMessage("");
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
    const nextIndex = Math.min(pasteArray.length, 5);
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus();
    }
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");
      console.log(typeof otp);
      const response = await axios.post("http://localhost:3000/api/verify", {
        email: formData.general.email,
        verificationCode: otp,
      });
      if (response.status == 200) {
        onDone();
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setErrorMessage("Le code est incorrect.");
      } else {
        setErrorMessage("Erreur du serveur. Veuillez réessayer plus tard.");
      }
      console.error("Verification error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      onSubmit={onSubmitHandler}
      className="w-full flex flex-col gap-y-5 bg-white px-5 py-8"
    >
      <h1 className="text-[20px] font-medium text-center">Verification code</h1>
      <p className="text-gray-500">
        Confirmez que cette adresse e-mail :
        <span className="font-semibold">{formData.general.email}</span> vous
        appartient .
      </p>
      <div className="flex justify-between gap-1" onPaste={handlePaste}>
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <input
              type="text"
              maxLength="1"
              key={index}
              required
              className="w-12 h-12 text-black text-center text-xl rounded-md border border-black"
              ref={(e) => (inputRefs.current[index] = e)}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
      </div>
      {errorMessage && (
        <Typography color="error" variant="body2" className="text-center">
          {errorMessage}
        </Typography>
      )}
      <Button variant="contained" type="submit" disabled={loading} fullWidth>
        {loading ? <CircularProgress size={24} /> : "Continue"}
      </Button>
    </form>
  );
};

export default VerifyEmail;

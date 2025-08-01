import React, { useContext } from "react";
import dyari from "../assets/dyari.svg";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../AuthProvider";
import Dyari from "../components/Dyari";

const AuthCustomer = () => {
  const { handleGoogleLogin } = useContext(AuthContext);
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen sm:bg-[#f5f5f5] bg-white gap-6">
      <Dyari />
      <h1 className=" text-amber-600">
        Se connecter en mode <span className="font-semibold">Client</span> :
      </h1>

      <div className="w-2/3 sm:w-[26%] flex flex-col gap-y-5 ">
        <div className="bg-white  rounded-md shadow-md hover:bg-gray-100 cursor-pointer">
          <GoogleLogin
            onSuccess={(res) => handleGoogleLogin(res)}
            onError={() => {
              console.log("Login Failed");
            }}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthCustomer;

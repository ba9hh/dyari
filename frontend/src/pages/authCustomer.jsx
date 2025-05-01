import React, { useContext } from "react";
import dyari from "../assets/dyari.svg";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../AuthProvider";

const AuthCustomer = () => {
  const { handleGoogleLogin } = useContext(AuthContext);
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-[#f5f5f5] gap-6">
      <Link className="absolute flex items-center gap-1 top-4 left-8" to={"/"}>
        <img className="w-7" src={dyari} />
        <h1 className="text-2xl font-medium text-amber-800">Dyari</h1>
      </Link>
      <h1 className=" text-amber-600">
        Se connecter en mode <span className="font-semibold">Client</span> :
      </h1>

      <div className="w-[26%] flex flex-col gap-y-5 ">
        <div className="bg-white  rounded-md shadow-md hover:bg-gray-100 cursor-pointer">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
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

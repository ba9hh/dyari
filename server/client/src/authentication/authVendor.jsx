import React from "react";
import dyari from "../assets/dyari.svg";
import vendor from "../assets/vendor.jpeg";
import customer from "../assets/customer1.png";
import { Link } from "react-router-dom";
import Dyari from "../components/Dyari";

const AuthVendor = () => {
  return (
    <>
    <div className="flex flex-col justify-center items-center w-full h-screen bg-white sm:bg-[#f5f5f5] gap-6">
      <Dyari/>
      <h1 className=" text-amber-600">Se connecter en mode <span className="font-semibold">Vendeur</span> :</h1>
      
        <div className="w-2/3 sm:w-[26%] flex flex-col gap-y-5 ">
        <Link className="bg-white p-2 sm:px-10 sm:py-3 rounded-md shadow-md hover:bg-gray-100 cursor-pointer" to={"/auth/vendor/register"}>
          <h1>Créer un nouveau compte</h1>    
        </Link>
        <Link className="bg-white p-2 sm:px-10 sm:py-3 rounded-md shadow-md hover:bg-gray-100 cursor-pointer" to={"/auth/vendor/login"}> 
          <h1>Se connecter à votre compte</h1>  
        </Link>
      
    </div>
    </div>
    </>
  );
};

export default AuthVendor;

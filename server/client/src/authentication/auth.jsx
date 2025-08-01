import React from "react";
import dyari from "../assets/dyari.svg";
import vendor from "../assets/vendor.jpeg";
import customer from "../assets/customer1.png";
import { Link } from "react-router-dom";
import Dyari from "../components/Dyari";

const Auth = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen sm:bg-[#f5f5f5] bg-white gap-4 sm:gap-6">
      <Dyari />
      <h1 className=" text-amber-600">Se connecter en mode :</h1>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6">
        <div className="w-full sm:w-[26%] flex flex-col gap-y-5 ">
          
          <Link to={"/auth/customer"} className="bg-white p-2 sm:px-10 sm:py-3 rounded-md shadow-md hover:bg-gray-100 cursor-pointer">
            <h1>
              <span className="font-semibold">Client</span> : Pour passer des commandes
            </h1>
          </Link>
          <Link to={"/auth/customer"} className="bg-white p-8 sm:px-10 sm:py-8 rounded-md shadow-md hover:bg-gray-100 cursor-pointer sm:block hidden">
            <img src={customer} className="w-full object-cover " />
          </Link>
        </div>
        <div className="block sm:hidden text-amber-600 py-1">
            Ou
        </div>
        <div className="w-full sm:w-[26%] flex flex-col gap-y-5 ">
          <Link to={"/auth/vendor"} className="bg-white p-2 sm:px-10 sm:py-3 rounded-md shadow-md hover:bg-gray-100 cursor-pointer">
            <h1>
              <span className="font-semibold">Vendeur</span> : Pour publier vos travails
            </h1>
          </Link>
          <Link to={"/auth/vendor"} className="bg-white p-8 sm:px-10 sm:py-8 rounded-md shadow-md hover:bg-gray-100 cursor-pointer sm:block hidden">
            <img src={vendor} className="w-full object-cover" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;

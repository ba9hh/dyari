import React from "react";
import dyari from "../assets/dyari.svg";
import vendor from "../assets/vendor.jpeg";
import customer from "../assets/customer1.png";
import { Link } from "react-router-dom";


const Auth = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-[#f5f5f5] gap-6">
      <Link className="absolute flex items-center gap-1 top-4 left-8" to={"/"}>
        <img className="w-7" src={dyari} />
        <h1 className="text-2xl font-medium text-amber-800">Dyari</h1>
      </Link>
      <h1 className=" text-amber-600">Se connecter en mode :</h1>
      <div className="flex justify-center gap-6">
        <div className="w-[26%] flex flex-col gap-y-5 ">
          
          <Link to={"/auth/customer"} className="bg-white px-10 py-3 rounded-md shadow-md hover:bg-gray-100 cursor-pointer">
            <h1>
              <span className="font-semibold">Client</span> : Pour passer des
              commandes
            </h1>
          </Link>
          <Link to={"/auth/customer"} className="bg-white px-10 py-8 rounded-md shadow-md hover:bg-gray-100 cursor-pointer">
            <img src={customer} className="w-full h-full object-cover" />
          </Link>
        </div>
        <div className="w-[26%] flex flex-col gap-y-5 ">
          <Link to={"/auth/vendor"} className="bg-white px-10 py-3 rounded-md shadow-md hover:bg-gray-100 cursor-pointer">
            <h1>
              <span className="font-semibold">Vendeur</span> : Pour publier vos
              travails
            </h1>
          </Link>
          <Link to={"/auth/vendor"} className="bg-white px-10 py-8 rounded-md shadow-md hover:bg-gray-100 cursor-pointer">
            <img src={vendor} className="w-full h-full object-cover" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;

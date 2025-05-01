import React from "react";
import womenCooking from "../assets/womenCooking.jpeg";
import sales from "../assets/sales.jpeg";
import sucres from "../assets/sucres.jpeg";
import biscuit from "../assets/biscuit.jpeg";
import gateau from "../assets/gateau.jpeg";
import downArrow from "../assets/downArrow.png";
import stir from "../assets/stir.gif";

const Introduction = () => {
  return (
    <div>
      <div className="flex w-full py-12 ">
        <div className="flex justify-end w-1/3">
          <img className="w-96" src={womenCooking} />
        </div>
        <div className="relative flex justify-center w-1/2 py-20 border-y-2 bg-[#fffafa]">
          <div className="absolute top-0 w-full h-2 bg-gradient-to-b from-fuchsia-300 to-transparent"></div>
          <div className="flex flex-col items-center">
            <div>
              <h1 className="text-center text-4xl text-fuchsia-600 crimsonText">
                Bienvenue chez Dyari
              </h1>
              <h1 className="border-y py-1 border-gray-500">
                Passez vos commandes pour toutes vos occasions spéciales !
              </h1>
            </div>
            <img className="mt-6 w-10" src={stir} />
            <div className="flex gap-8 mt-8">
              <div className="flex flex-col items-center gap-1">
                <img className="w-32" src={sales} />
                <h1 className="font-medium">Du salés</h1>
              </div>
              <div className="flex flex-col items-center gap-1">
                <img className="w-32" src={sucres} />
                <h1 className="font-medium">Du sucres</h1>
              </div>
              <div className="flex flex-col items-center gap-1">
                <img className="w-32" src={gateau} />
                <h1 className="font-medium">Les gateaux</h1>
              </div>
              <div className="flex flex-col items-center gap-1">
                <img className="w-32" src={biscuit} />
                <h1 className="font-medium">Les biscuits</h1>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 w-full h-2 bg-gradient-to-t from-fuchsia-300 to-transparent"></div>
        </div>
      </div>
      <div className=" flex w-full justify-center items-center gap-x-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <h1 className="px-3 py-2">Du sales</h1>
        <h1 className="px-3 py-2">Du Sucres</h1>
        <h1 className="px-3 py-2 border-b-2 border-gray-600">Un mélange</h1>
        <h1 className="px-3 py-2">Les gateaux</h1>
        <h1 className="px-3 py-2">Les biscuits</h1>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <div className="flex justify-end py-3 px-8">
        <div className="flex items-center border-2 pr-4">
          <h1 className="pl-4 pr-1 py-2 ">Toute la Tunisie</h1>
          <img className="w-5 h-5" src={downArrow} />
        </div>
      </div>
    </div>
  );
};

export default Introduction;

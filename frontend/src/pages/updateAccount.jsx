import React from "react";
import dyari from "../assets/dyari.svg";
import { Link } from "react-router-dom";

const UpdateAccount = () => {
  return (
    <div>
      <Link className="absolute flex items-center gap-1 top-4 left-8" to={"/"}>
        <img className="w-7" src={dyari} />
        <h1 className="text-2xl font-medium text-amber-800">Dyari</h1>
      </Link>
      <div className="flex flex-col h-screen items-center pt-16 bg-[#F5F5F5] gap-y-4">
        <div className="relative w-1/2 bg-white shadow-md rounded-md ">
          <div className="flex flex-col gap-1 p-3">
            <Link className=" hover:bg-gray-100 p-2" to={"profile-picture"} >
              Modifer votre{" "}
              <span className="font-semibold">photo de profile</span>
            </Link>
            <Link className=" hover:bg-gray-100 p-2" to={"name"}>
              Modifer votre <span className="font-semibold">nom</span>
            </Link>
            <Link className=" hover:bg-gray-100 p-2" to={"last-name"}>
              Modifer votre <span className="font-semibold">prenom</span>
            </Link>
            <Link className=" hover:bg-gray-100 p-2" to={"location"}>
              Modifer votre <span className="font-semibold">region</span>
            </Link>
            <Link className=" hover:bg-gray-100 p-2" to={"speciality"}>
              Modifer votre <span className="font-semibold">specialite</span>
            </Link>
            <Link className=" hover:bg-gray-100 p-2" to={"items"}>
              Modifer vos <span className="font-semibold">articles</span>
            </Link>
            <Link className=" hover:bg-gray-100 p-2" to={"password"}>
              Modifer votre <span className="font-semibold">mot de passe</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAccount;

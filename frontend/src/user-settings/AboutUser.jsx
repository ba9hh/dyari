import { useState, useEffect } from "react";
import GeneralAboutUser from "./GeneralAboutUser";
import DeleteUser from "./DeleteUser";
import Dyari from "../components/Dyari";

const AboutUser = ({ userId }) => {
  
  return (
    <div className="flex justify-center items-center pt-16 pb-8 sm:bg-[#F5F5F5] bg-white min-h-screen">
      <Dyari />
      <div className="w-fit sm:w-fit bg-white shadow-md rounded-md pt-8 pb-8 px-12">
        <GeneralAboutUser userId={userId} />
        <DeleteUser />
      </div>
    </div>
  );
};

export default AboutUser;

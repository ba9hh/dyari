import React from "react";
import Shops from "./Shops";
import NavBar from "./NavBar";
import dyari from "../assets/dyari.svg";
import downArrow from "../assets/downArrow.png";

const Home = () => {
  return (
    <div className="bg-[#f5f5f5]">
      <NavBar />
      <Shops />
    </div>
  );
};

export default Home;

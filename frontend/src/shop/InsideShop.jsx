import React, { useState, useEffect, useContext } from "react";
import dyari from "../assets/dyari.svg";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import RatingTest from "../components/ratingTest"
import { AuthContext } from "../AuthProvider";
import Articles from "../components/Articles";

const InsideShop = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [shop, setShop] = useState([]);
  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/shop/${id}`
        );
        setShop(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchHouse(); // Call the function to fetch house details on component mount
  }, [id]);
  return (
    <div className="flex flex-col h-screen items-center pt-16 bg-[#F5F5F5] gap-y-4">
      <Link className="absolute flex items-center gap-1 top-4 left-8" to={"/"}>
        <img className="w-7" src={dyari} />
        <h1 className="text-2xl font-medium text-amber-800">Dyari</h1>
      </Link>
      <div className="relative w-1/2 bg-white shadow-md rounded-md">
        <Link
          className="absolute top-4 right-2 px-3 pb-2 pt-1 bg-blue-600 text-white text-sm font-medium rounded-md"
          to={"order"}
        >
          Passer votre commande
        </Link>
         <div className="absolute top-0 left-0">
          <RatingTest shopId={id} user={user}  />
        </div> 
        <div className="h-48 bg-gradient-to-t from-gray-300 to-transparent flex justify-center items-center">
          {/* <button className="bg-white px-3 pb-2 pt-1 shadow-md rounded-md">Ajouter un photo de couverture</button> */}
        </div>
        <div className="flex justify-center -mt-6">
          <div className="flex flex-col items-center gap-1 mb-4">
            <img
              className="w-20 h-20 border-2 p-1 rounded-full bg-white"
              src={shop.profilePicture}
            />
            <h1 className="text-lg">
              {shop.name} {shop.lastName} ({shop.localisation})
            </h1>
            {shop.speciality?.length == 1 && (
              <h1 className="crimsonText my-0">
                Specialité : {shop.speciality?.[0]}
              </h1>
            )}
            {shop.speciality?.length == 2 && (
              <h1 className="crimsonText my-0">
                Specialité : {shop.speciality?.[0]} et {shop.speciality?.[1]}
              </h1>
            )}
            {shop.speciality?.length == 3 && (
              <h1 className="crimsonText my-0">
                Specialité : {shop.speciality?.[0]} , {shop.speciality?.[1]} et{" "}
                {shop.speciality?.[2]}
              </h1>
            )}
            {shop.speciality?.length == 1 && (
              <h1 className="crimsonText my-0">
                Specialité : {shop.speciality?.[0]} , {shop.speciality?.[1]} ,{" "}
                {shop.speciality?.[2]} et {shop.speciality?.[3]}
              </h1>
            )}
            <button className="px-3 pb-2 pt-1 bg-gray-100 rounded-md font-medium text-sm mt-2">
              Contacter
            </button>
          </div>
        </div>
      </div>
      {/* <div className="flex items-center mt-5">
          <div className="w-10 border-t border-gray-300"></div>
          <h1>Fait par Samira</h1>
          <div className="flex-grow border-t border-gray-300"></div>
        </div> */}
      <div className="w-1/2 bg-white shadow-md rounded-md py-3">
        {/* <div className="flex justify-center mt-2">
          <img className="w-14 h-14" src={profilePost} />
        </div> */}
        {/* <div className=" flex justify-center items-center gap-x-4">
          <div className="flex-grow border-t border-blue-300"></div>
          <h1 className="font-medium text-blue-800 px-3 py-2">
            Faite par Samira
          </h1>
          <div className="flex-grow border-t border-blue-300"></div>
        </div> */}
        <span className="font-medium text-black my-2 ml-7 border-b pb-1 border-gray-700">
          Travail de {shop.name}
        </span>
        <div className="grid grid-cols-3 gap-x-6 gap-y-6 px-8 mt-4">
          {shop.articles?.map((article, index) => (
            <Articles article={article} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsideShop;

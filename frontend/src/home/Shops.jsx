import React, { useEffect, useState } from "react";
import biscuit50 from "../assets/biscuit50.jpg";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import SkeletonShops from "../components/SkeletonShops";


const Shops = () => {
  const [shops, setShops] = useState([]);
  const [localisation, setLocalisation] = useState("All Countries");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/shops?page=1&limit=10`, {
            params: { localisation: localisation === "All Countries" ? "" : localisation },
          });

        const newHouses = response.data;
        setShops(newHouses);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, [localisation]);
  if (loading) return <SkeletonShops/>
  return (
    <div>
      <div className="flex justify-end py-3 px-8">
      <select
        name="localisation"
        value={localisation}
        onChange={(e) => setLocalisation(e.target.value)}
        className="h-[36px] text-[#1c1e21] rounded-[4px] px-[8px] pr-[20px] border border-gray-400 w-40"
      >
        <option value="All Countries">All Countries</option>
        {["Tunisie", "Ariana", "Manouba", "Ben Arous", "Nabeul", "Bizerte", "Zaghouan", "Sousse", "Monastir",
          "Mahdia", "Sfax", "Béja", "Jendouba", "Le Kef", "Siliana", "Kairouan", "Sidi Bouzid", "Kasserine",
          "Gabès", "Médenine", "Gafsa", "Tozeur", "Tataouine", "Kébili"].map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
      </div>
      <div className="lg:grid-cols-2 md:grid-cols-2 grid grid-cols-1 gap-x-16 gap-y-20 mx-20 mb-20 mt-4">
        {shops.map((shop) => (
          <Link
            key={shop._id}
            to={"/insideshop/" + shop._id}
            className="bg-white shadow-md py-3 px-5 rounded-md"
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <img
                  className="w-10 h-10 rounded-full border"
                  src={shop.profilePicture}
                />
                <div>
                  <h1 className="my-0">
                    {shop.name} {shop.lastName} ({shop.localisation})
                  </h1>
                  {shop.speciality?.length == 1 && (
                    <span className="crimsonText my-0">
                      Specialité : {shop.speciality?.[0]}
                    </span>
                  )}
                  {shop.speciality?.length == 2 && (
                    <span className="crimsonText my-0">
                      Specialité : {shop.speciality?.[0]} et{" "}
                      {shop.speciality?.[1]}
                    </span>
                  )}
                  {shop.speciality?.length == 3 && (
                    <span className="crimsonText my-0">
                      Specialité : {shop.speciality?.[0]} ,{" "}
                      {shop.speciality?.[1]} et {shop.speciality?.[2]}
                    </span>
                  )}
                  {shop.speciality?.length == 4 && (
                    <span className="crimsonText my-0">
                      Specialité : {shop.speciality?.[0]} ,{" "}
                      {shop.speciality?.[1]} , {shop.speciality?.[2]} et{" "}
                      {shop.speciality?.[3]}
                    </span>
                  )}
                  
                </div>
              </div>
              <div className="flex items-center">
                <h1>{shop.rating}</h1>
                <ReactStars
                  count={5} // Number of stars
                  size={20} // Size of the stars
                  value={shop.rating}
                  isHalf={true} // Enable half stars
                  edit={false}
                  activeColor="#FBBC04" // Active star color
                />
                <h1>({shop.numberPeopleRated})</h1>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1 mt-1 border">
              <img
                className="w-full h-56 border object-cover"
                src={shop.articles[0]?.image || biscuit50}
              />
              <img
                className="w-full h-56 border object-cover"
                src={shop.articles[1]?.image || biscuit50}
              />
              <img
                className="w-full h-56 border object-cover"
                src={shop.articles[2]?.image || biscuit50}
              />
              <img
                className="w-full h-56 border object-cover"
                src={shop.articles[3]?.image || biscuit50}
              />
              <img
                className="w-full h-56 border object-cover"
                src={shop.articles[4]?.image || biscuit50}
              />
              <img
                className="w-full h-56 border object-cover"
                src={shop.articles[5]?.image || biscuit50}
              />
            </div>
          </Link>
        ))}
        
      </div>
      <h1>{shops.length}</h1>
    </div>
  );
};

export default Shops;

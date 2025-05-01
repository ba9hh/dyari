import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import axios from "axios";
import SkeletonShops from "../components/SkeletonShops";
import NavBar from "./NavBar";
import ShopItem from "../components/ShopItem";

const ShopsType = () => {
  const { type } = useParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const shopType = type || "";
  const [shops, setShops] = useState([]);
  const [localisation, setLocalisation] = useState("All Countries");
  const [loading, setLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    const controller = new AbortController();
    const fetchShops = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/api/shops/category",
          {
            params: {
              type: shopType,
              localisation:
                localisation === "All Countries" ? "" : localisation,
              page,
              limit,
            },
          }
        );
        setShops(response.data.shops);
        const totalPages = response.data.totalPages || 0;
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
    return () => controller.abort();
  }, [shopType, localisation, page]);
  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };
  if (loading)
    return (
      <div className="bg-[#f5f5f5]">
        <NavBar />
        <SkeletonShops />
      </div>
    );
  return (
    <div className="bg-[#f5f5f5]">
      <NavBar />
      <div className="flex justify-end py-3 px-8">
        <select
          name="localisation"
          value={localisation}
          onChange={(e) => setLocalisation(e.target.value)}
          className="h-[36px] text-[#1c1e21] rounded-[4px] px-[8px] pr-[20px] border border-gray-400 w-40"
        >
          <option value="All Countries">All Countries</option>
          {[
            "Tunisie",
            "Ariana",
            "Manouba",
            "Ben Arous",
            "Nabeul",
            "Bizerte",
            "Zaghouan",
            "Sousse",
            "Monastir",
            "Mahdia",
            "Sfax",
            "Béja",
            "Jendouba",
            "Le Kef",
            "Siliana",
            "Kairouan",
            "Sidi Bouzid",
            "Kasserine",
            "Gabès",
            "Médenine",
            "Gafsa",
            "Tozeur",
            "Tataouine",
            "Kébili",
          ].map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <div className="lg:grid-cols-2 md:grid-cols-2 grid grid-cols-1 gap-x-16 gap-y-20 sm:mx-20 mt-4 ">
        {shops.length > 0 ? (
          shops.map((shop) => <ShopItem key={shop._id} shop={shop} />)
        ) : (
          <h1> empty</h1>
        )}
      </div>
      <div className="relative pagination flex items-center justify-center gap-4 mt-4 py-3">
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaArrowLeft /> Page précédente
        </button>
        
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Page suivante <FaArrowRight />
        </button>
        <span className="absolute right-4 font-semibold text-gray-500">
          Page {page} sur {totalPages}
        </span>
      </div>
    </div>
  );
};

export default ShopsType;

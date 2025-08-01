import React, { useState, useEffect } from "react";
import axios from "axios";
import LikedShopsShop from "./LikedShopsShop";
import thinking from "../../assets/thinking.png";
import LikedShopsSkeleton from "../../skeleton/user-profile/LikedShopsSkeleton";

const LikedShopsUser = ({ userId }) => {
  const [likedShops, setLikedShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://dyari.onrender.com/api/user/liked-shops`
        );
        setLikedShops(response.data.likedShops);
      } catch (error) {
        console.error("Error fetching user liked shops :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLikes();
  }, []);
  if(loading){
    return <LikedShopsSkeleton/>
  }
  return (
    <div className="w-full sm:w-2/3 bg-white shadow-md rounded-md py-2 sm:py-8">
      <div className="flex flex-col px-1 sm:px-3 gap-2">
        {likedShops?.length > 0 ? (
          likedShops.map((likedShop, index) => (
            <div key={index}>
              <LikedShopsShop shop={likedShop} userId={userId} />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500 border border-dashed border-gray-300 rounded-xl mt-3">
            <img src={thinking} className="h-16 w-16 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              No Favorite Shops yet
            </h2>
            <p className="text-center max-w-md">
              You don’t have any favorite shops at the moment. Once you like a
              shop , they’ll appear here for you to manage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedShopsUser;

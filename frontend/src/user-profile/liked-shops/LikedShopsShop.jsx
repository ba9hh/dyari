import React, { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axios from "axios";
import { Link } from "react-router-dom";
const LikedShopsShop = ({ shop,userId }) => {
  const [liked, setLiked] = useState(true);
  const toggleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/user/${userId}/shop/${shop._id}`,
        {},
        { withCredentials: true }
      );
      setLiked(!liked);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex justify-between items-center border sm:p-2 p-1 rounded">
      <Link className="flex flex-1 gap-2" to={`/insideshop/${shop._id}`}>
        <img
          className="w-10 h-10 rounded-full border"
          src={shop.profilePicture}
          alt="Shop Profile"
        />
        <div>
          <h1 className="my-0">
            <span className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200">{shop.name} {shop.lastName}</span> ({shop.localisation})
          </h1>
          {shop.speciality?.length == 1 && (
            <span className="crimsonText my-0">
              Specialité : {shop.speciality?.[0]}
            </span>
          )}
          {shop.speciality?.length == 2 && (
            <span className="crimsonText my-0">
              Specialité : {shop.speciality?.[0]} et {shop.speciality?.[1]}
            </span>
          )}
          {shop.speciality?.length == 3 && (
            <span className="crimsonText my-0">
              Specialité : {shop.speciality?.[0]} , {shop.speciality?.[1]} et{" "}
              {shop.speciality?.[2]}
            </span>
          )}
          {shop.speciality?.length == 4 && (
            <span className="crimsonText my-0">
              Specialité : {shop.speciality?.[0]} , {shop.speciality?.[1]} ,{" "}
              {shop.speciality?.[2]} et {shop.speciality?.[3]}
            </span>
          )}
        </div>
      </Link>
      <div className="flex w-fit gap-1">
        <div className="flex items-center">
          <h1>{shop.averageRating}</h1>
          <ReactStars
            count={5}
            size={20}
            value={shop.averageRating || 0}
            isHalf={true}
            edit={false}
            activeColor="#FBBC04"
          />
          <h1>({shop.totalRating})</h1>
        </div>
        <IconButton onClick={toggleLike} color={liked ? "error" : "default"}>
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </div>
    </div>
  );
};

export default LikedShopsShop;

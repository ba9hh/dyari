import React, { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import axios from "axios";

const RatingTest = ({ shopId, user }) => {
  const [rating, setRating] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch user's previous rating (optional)
    axios.get(`http://localhost:3000/api/shop/${shopId}`).then((response) => {
      const shop = response.data;
      console.log(shop);
      const userRating =
        shop.rating?.find((r) => r.user == user?._id)?.rating || 0;
      setRating(userRating);
      console.log(rating);
    });
  }, [shopId, user]);

  const submitRating = async () => {
    // Send rating to backend
    try {
      const response = await axios.post(
        `http://localhost:3000/api/shop/${shopId}/rate`,
        { rating: rating },
        { withCredentials: true }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "An error occurred while submitting your rating."
      );
    }
  };

  return (
    <div className="pl-1">
      <ReactStars
        key={rating}
        count={5}
        value={rating}
        size={25}
        activeColor="#ffd700"
        onChange={setRating} // Updates rating when clicked
      />
      {rating>0 && (
        <button
          onClick={submitRating}
          className="mt-[2px] px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Submit Rating
        </button>
      )}
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </div>
  );
};

export default RatingTest;

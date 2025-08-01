import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider";
import ReactStars from "react-rating-stars-component";
import axios from "axios";
import { toast } from "react-toastify";

const RatingTest = ({ shopId }) => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(null);
  const [initialRating, setInitialRating] = useState(null);
  const [message, setMessage] = useState("");
  const [canRate, setCanRate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchRatingData = async () => {
        setCanRate(null); // loading state
        try {
          const res = await axios.get(
            `https://dyari.onrender.com/api/shop/${shopId}/can-rate`,
            { withCredentials: true }
          );
          setCanRate(res.data.canRate);

          // fetch existing rating if user can rate
          if (res.data.canRate) {
            const { data } = await axios.get(
              `https://dyari.onrender.com/api/shop/${shopId}/rating`,
              { withCredentials: true }
            );

            if (data.rating != null) {
              setRating(data.rating);
              setInitialRating(data.rating);
            } else {
              setRating(null);
              setInitialRating(null);
            }
          } else {
            // user not allowed yet
            setRating(null);
            setInitialRating(null);
          }
        } catch (error) {
          console.error("Error fetching rating data:", error);
          setCanRate(false);
          setRating(null);
          setInitialRating(null);
        }
      };

      fetchRatingData();
    } else {
      // no user logged in
      setCanRate(null);
      setRating(null);
      setInitialRating(null);
    }
  }, [user, shopId]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    // mark dirty if changed from initial
    if (initialRating === null || newRating !== initialRating) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  };

  const submitRating = async () => {
    if (!user  || user?.role == "shop" ) {
      setMessage("You must be logged in as a user to rate a shop.");
      return;
    }
    if (!canRate) {
      setMessage("You cannot rate this shop until you have an accepted order.");
      return;
    }
    if (rating == null) {
      setMessage("Please select a rating before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await axios.post(
        `https://dyari.onrender.com/api/shop/${shopId}/rate`,
        { rating: rating },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      // after submitting, reset initial and dirty
      setInitialRating(rating);
      setIsDirty(false);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "An error occurred while submitting your rating."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pl-1">
      <ReactStars
        key={initialRating} // re-mount on initial change
        count={5}
        value={rating}
        size={25}
        activeColor="#ffd700"
        onChange={handleRatingChange}
      />

      {/* Show submit only if there's no initial rating (new) or the user modified it */}
      {((initialRating === null && rating > 0) || isDirty) && (
        <button
          disabled={submitting}
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

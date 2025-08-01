import { useState, useEffect, useContext } from "react";
import axios from "axios";
import SkeletonInformationShop from "./SkeletonInformationShop";
import { Link } from "react-router-dom";
import RatingTest from "../components/ratingTest";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AuthContext } from "../AuthProvider";
import Button from "@mui/material/Button";
import { Tabs, Tab, Box } from "@mui/material";
import LoginRequiredDialog from "../components/LoginRequiredDialog";

const InformationShop = ({ shopId, handleChange, activeTab }) => {
  const [shop, setShop] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const { user } = useContext(AuthContext);
  const [isConnected, setIsConnected] = useState(false);
  const handleClose = () => {
    setIsConnected(false);
  };
  useEffect(() => {
    const fetchShopInformation = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://dyari.onrender.com/api/shop/${shopId}/information`
        );
        setShop(response.data);
      } catch (error) {
        console.error("Error fetching shop information:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchLikes = async () => {
      try {
        const response = await axios.get(
          `https://dyari.onrender.com/api/user/is-shop-liked/${shopId}`
        );
        if (response.data.liked) {
          setLiked(true);
        } else {
          setLiked(false);
        }
      } catch (error) {
        console.error("Error fetching user liked shops :", error);
      }
    };
    fetchShopInformation();
    if (user && user?.role === "user") {
      fetchLikes();
    }
  }, []);
  const toggleLike = async () => {
    if (!user || user?.role == "shop") {
      setIsConnected(true);
      return;
    }
    try {
      const response = await axios.post(
        `https://dyari.onrender.com/api/user/shop/${shopId}`,
        {},
        { withCredentials: true }
      );
      setLiked(response.data.liked);
    } catch (err) {
      console.error(err);
    }
  };
  if (loading) return <SkeletonInformationShop />;
  return (
    <div className="relative w-full sm:w-2/3 bg-white shadow-md rounded-md">
      <Button
        variant="contained"
        color="primary"
        size="small"
        sx={{
          textTransform: "none",
          position: "absolute",
          top: "2px",
          right: "4px",
        }}
        to={"order"}
        component={Link}
      >
        Passer votre commande
      </Button>
      <div className="absolute top-0 left-0">
        <RatingTest shopId={shopId} />
      </div>
      <div className="h-28 sm:h-40 bg-gradient-to-t from-gray-300 to-transparent flex justify-center items-center"></div>
      <div className="flex justify-center -mt-6">
        <div className="flex flex-col items-center gap-1 mb-4">
          <img
            className="w-16 h-16 border-2 p-1 rounded-full bg-white"
            src={shop?.profilePicture}
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
          {shop.speciality?.length == 4 && (
            <h1 className="crimsonText my-0">
              Specialité : {shop.speciality?.[0]} , {shop.speciality?.[1]} ,{" "}
              {shop.speciality?.[2]} et {shop.speciality?.[3]}
            </h1>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 z-10">
        <IconButton onClick={toggleLike} color={liked ? "error" : "default"}>
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </div>
      <Box sx={{ borderTop: 1, borderColor: "divider", width: "100%" }}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="standard"
          sx={{ mb: 0, px: 2 }}
          TabIndicatorProps={{
            style: {
              height: "4px",
            },
          }}
          centered
        >
          <Tab
            label="Articles"
            value="articles"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          />
          <Tab
            label="Contact"
            value="contact"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          />
        </Tabs>
      </Box>
      <LoginRequiredDialog
        open={isConnected}
        onClose={handleClose}
        message="You must be logged in as a user to like a shop"
      />
    </div>
  );
};

export default InformationShop;

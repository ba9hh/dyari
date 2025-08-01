import React from "react";
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Link } from "react-router-dom";
const ContactShop = ({ shopId }) => {
  const [additionalInfo, setAdditionalInfo] = useState({});
  useEffect(() => {
    const fetchShopInformation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/shop/${shopId}/additional-info`
        );
        console.log(response.data.data);
        setAdditionalInfo(response.data.data);
      } catch (error) {
        console.error("Error fetching shop information:", error);
      }
    };
    fetchShopInformation();
  }, []);
  console.log(Object.keys(additionalInfo).length);
  return (
    <div className="w-full sm:w-2/3 bg-white shadow-md rounded-md pt-3 pb-8">
      <Typography
        variant="body1"
        align="center"
        sx={{
          py: 2,
          color: "grey.800",
        }}
      >
        Contact (Facebook ,Whatsapp , ...)
      </Typography>

      <div className="flex flex-col gap-6 px-6">
        {Object.keys(additionalInfo).length !== 0 ? (
          <>
            {additionalInfo.facebook && (
              <div className="flex items-center gap-2">
                <FacebookIcon
                  style={{ fontSize: "1.6rem", color: "#1e88e5" }}
                />
                <a
                  href={additionalInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  {additionalInfo.facebook}
                </a>
              </div>
            )}

            {additionalInfo.instagram && (
              <div className="flex items-center gap-2">
                <InstagramIcon
                  style={{ fontSize: "1.6rem", color: "#e1306c" }}
                />
                <a
                  href={additionalInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  {additionalInfo.instagram}
                </a>
              </div>
            )}
            {additionalInfo.whatsapp && (
              <div className="flex items-center gap-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                  alt="WhatsApp"
                  style={{ width: "24px", height: "24px" }}
                />
                <h1 className="text-sm underline text-blue-600">
                  {additionalInfo.whatsapp}
                </h1>
              </div>
            )}
            {additionalInfo.tiktok && (
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg"
                  alt="TikTok"
                  style={{ width: "24px", height: "24px" }}
                />

                <a
                  href={additionalInfo.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  {additionalInfo.tiktok}
                </a>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-500 border border-dashed border-gray-300 rounded-xl mt-3">
            <h1 className="text-3xl">🚫</h1>
            <h1> This shop hasn’t provided any contact information yet.</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactShop;

import { useContext, useState } from "react";
import GeneralAboutShop from "./GeneralAboutShop";
import ContactShop from "./ContactShop";
import DeleteShop from "./DeleteShop";
import { AuthContext } from "../AuthProvider";
import Dyari from "../components/Dyari";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const AboutShop = ({ shopId }) => {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex justify-center pt-16 pb-8 sm:bg-[#F5F5F5] bg-white">
      <Dyari />
      <div className="w-fit sm:w-fit bg-white shadow-md rounded-md pt-3 pb-8">
        <GeneralAboutShop shopId={user._id} />
        <ContactShop shopId={user._id} />
        <div className="mt-4 px-6">
          <Typography
            variant="body1"
            align="center"
            gutterBottom
            sx={{
              py: 2,
              color: "grey.800",
            }}
          >
            Update password
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            component={Link}
            to="change-password"
          >
            update password
          </Button>
        </div>
        <DeleteShop shopId={user._id} />
      </div>
    </div>
  );
};

export default AboutShop;

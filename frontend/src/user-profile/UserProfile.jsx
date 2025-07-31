import InformationUser from "./InformationUser";
import OrdersUser from "./orders/OrdersUser";
import Dyari from "../components/Dyari";
import AboutUser from "../user-settings/AboutUser";
import LikedShopsUser from "./liked-shops/LikedShopsUser";
import RatedShopsUser from "./rated-shops/RatedShopsUser";
import { useState } from "react";
const UserProfile = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("orders");
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  return (
    <div className="flex flex-col min-h-screen items-center pt-16 pb-8 bg-white sm:bg-[#F5F5F5] gap-y-4">
      <Dyari />
      <InformationUser
        userId={userId}
        handleChange={handleChange}
        activeTab={activeTab}
      />
      {activeTab === "orders" && <OrdersUser userId={userId} />}
      {activeTab === "ratedShops" && <RatedShopsUser userId={userId} />}
      {activeTab === "likedShops" && <LikedShopsUser userId={userId} />}
    </div>
  );
};

export default UserProfile;

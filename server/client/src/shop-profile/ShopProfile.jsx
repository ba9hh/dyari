import { useState } from "react";
import InformationShop from "./InformationShop";
import ArticlesShop from "./articles/ArticlesShop";
import OrdersShop from "./orders/OrdersShop";
import Dyari from "../components/Dyari";
import Button from "@mui/material/Button";

const ShopProfile = ({ shopId }) => {
  const [activeTab, setActiveTab] = useState("articles");
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  return (
    <div className="flex flex-col min-h-screen items-center pt-16 pb-8 sm:bg-[#F5F5F5] bg-white gap-y-4">
      <Dyari />
      <InformationShop shopId={shopId} handleChange={handleChange} activeTab={activeTab}/>
      
      {activeTab === "articles" && <ArticlesShop shopId={shopId} />}
      {activeTab === "orders" && <OrdersShop shopId={shopId} />}
    </div>
  );
};

export default ShopProfile;

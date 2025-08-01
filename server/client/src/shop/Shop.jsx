import InformationShop from "./InformationShop";
import ArticlesShop from "./ArticlesShop";
import ContactShop from "./ContactShop";
import Dyari from "../components/Dyari";
import { useParams } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../AuthProvider";
import LoginRequiredDialog from "../components/LoginRequiredDialog";

const Shop = () => {
  const { user } = useContext(AuthContext);
  const { shopId } = useParams();
  const [activeTab, setActiveTab] = useState("articles");
  const [isConnected, setIsConnected] = useState(false);
  const handleClose = () => {
    setIsConnected(false);
  };
  const handleChange = (event, newValue) => {
    if (newValue === "contact") {
      if (!user) {
        setIsConnected(true);
        return;
      }
      setActiveTab("contact");
    } else {
      setActiveTab(newValue);
    }
  };
  return (
    <div className="flex flex-col min-h-screen items-center pt-16 pb-8 bg-white sm:bg-[#F5F5F5] gap-y-4 w-full">
      <Dyari />
      <InformationShop
        shopId={shopId}
        handleChange={handleChange}
        activeTab={activeTab}
      />
      {activeTab === "articles" && <ArticlesShop shopId={shopId} />}
      {activeTab === "contact" && <ContactShop shopId={shopId} />}
      <LoginRequiredDialog
        open={isConnected}
        onClose={handleClose}
        message="You must be logged in to see the shop additional information"
      />
    </div>
  );
};

export default Shop;

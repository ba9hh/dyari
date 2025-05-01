import React, { useState, useContext } from "react";
import dyari from "../assets/dyari.svg";
import pdp from "../assets/pdp.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthProvider";
import OrderShopItem from "../account/OrderShopItem";
import OrderUserItem from "../account/OrderUserItem";
import Articles from "../components/Articles";
import ReactStars from "react-rating-stars-component";

const Account = () => {
  const { user, setUser, handleLogout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("orders");
  const updateOrderState = async (shopId, userId, orderId, newState) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/shopsandusers/${shopId}/${userId}/orders/${orderId}/state`,
        {
          state: newState,
        }
      );
      setUser(response.data.updatedShop);
      console.log("Order updated:", response.data);
    } catch (error) {
      console.error(
        "Error updating order state:",
        error.response?.data || error.message
      );
    }
  };
  console.log(user);

  return (
    <div>
      <Link className="absolute flex items-center gap-1 top-4 left-8" to={"/"}>
        <img className="w-7" src={dyari} />
        <h1 className="text-2xl font-medium text-amber-800">Dyari</h1>
      </Link>
      <div className="flex flex-col h-screen items-center pt-16 bg-[#F5F5F5] gap-y-4">
        <div className="relative w-1/2 bg-white shadow-md rounded-md">
          <div className="flex gap-2 absolute top-4 right-2">
            <Link
            to={"/update-account"}
              className=" px-3 pb-2 pt-1 bg-blue-600 text-white text-sm font-medium rounded-md"
            >
              Modifier le profil
            </Link>
            <button
              className=" px-3 pb-2 pt-1 bg-blue-600 text-white text-sm font-medium rounded-md"
              onClick={() => handleLogout()}
            >
              logout
            </button>
          </div>

          <div className="absolute top-0 left-0 flex items-center px-1">
            <h1>{user?.averageRating}</h1>
            <ReactStars
              count={5}
              size={20}
              value={user?.averageRating || 0}
              isHalf={true}
              edit={false}
              activeColor="#FBBC04"
            />
            <h1>({user?.totalRating})</h1>
          </div>

          <div className="h-32 bg-gradient-to-t from-gray-300 to-transparent flex justify-center items-center"></div>
          <div className="flex justify-center -mt-6">
            <div className="flex flex-col items-center gap-1 mb-4">
              <img
                className="w-16 h-16 border-2 p-1 rounded-full bg-white"
                src={user ? user.profilePicture : pdp}
              />
              <div className="flex flex-col items-center">
                <h1 className="text-lg">
                  {user ? user.name : ""} {user ? user.lastName : ""}
                </h1>
                <h1 className="text-sm text-gray-400">
                  {user ? user.email : ""}
                </h1>
              </div>
            </div>
          </div>
        </div>
        {user?.articles ? (
          <div className="w-1/2 bg-white shadow-md rounded-md py-3">
            <div className="flex gap-x-2 items-center">
              <h1
                className={`font-medium text-black my-2 ml-2 border-b pb-1 w-fit cursor-pointer ${
                  activeTab == "orders"
                    ? "border-gray-700"
                    : "border-transparent"
                }`}
                onClick={() => setActiveTab("orders")}
              >
                Votres commandes
              </h1>
              <h1
                className={`font-medium text-black my-2 ml-2 border-b pb-1 w-fit cursor-pointer ${
                  activeTab == "work" ? "border-gray-700" : "border-transparent"
                }`}
                onClick={() => setActiveTab("work")}
              >
                Votre travail
              </h1>
            </div>
            {activeTab == "work" && (
              <div className="grid grid-cols-3 gap-x-6 gap-y-6 px-8 mt-4">
                {user?.articles?.map((article, index) => (
                  <Articles article={article} key={index} />
                ))}
              </div>
            )}
            {activeTab == "orders" && (
              <div className="flex flex-col gap-y-3 px-3">
                {user?.orders
                  ?.slice()
                  .reverse()
                  .map((order, index) => (
                    <OrderShopItem
                      key={index}
                      order={order}
                      index={user?.orders?.length - index}
                      userId={user?._id}
                      updateOrderState={updateOrderState}
                    />
                  ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-1/2 bg-white shadow-md rounded-md p-3">
            <h1 className="font-medium text-black my-2 ml-2  border-b pb-1 border-gray-700 w-fit">
              Historique de vos commandes
            </h1>
            <div className="flex flex-col gap-y-3">
              {user?.orders
                ?.slice()
                .reverse()
                .map((order, index) => (
                  <OrderUserItem
                    order={order}
                    index={user?.orders?.length - index}
                    key={index}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;

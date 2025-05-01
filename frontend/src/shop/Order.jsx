import React, { useState, useContext, useEffect } from "react";
import biscuit50 from "../assets/biscuit50.jpg";
import dyari from "../assets/dyari.svg";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthProvider";
import { GoogleLogin } from "@react-oauth/google";

const Order = () => {
  const { user, handleGoogleLogin } = useContext(AuthContext);
  const { id } = useParams();
  const [isConnected, setIsConnected] = useState(false);
  const [shopData, setShopData] = useState([]);
  const [order, setOrder] = useState({
    clientPhoneNumber: "",
    items: [
      {
        type: "", // Possible values: "1 kg", "1 piéce"
        price: 0,
        image: "",
        quantity: 0,
      },
    ],
    totalAmount: 0,
  });
  const [showArticles, setShowArticles] = useState({
    display: false,
    item: null,
  });
  const handleClick = (index) => {
    setShowArticles({
      display: true,
      item: index,
    });
  };
  const handleInputChange = (e) => {
    const { value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      clientPhoneNumber: value, // Update clientPhoneNumber
    }));
  };
  const updateItem = (updatedValues, itemIndex) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: prevOrder.items.map((item, index) =>
        index === itemIndex ? { ...item, ...updatedValues } : item
      ),
    }));
  };
  const updateQuantity = (newQuantity, itemIndex) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: prevOrder.items.map((item, index) =>
        index === itemIndex ? { ...item, quantity: newQuantity } : item
      ),
    }));
  };
  const handleAddItem = () => {
    // Define the new item
    const newItem = {
      type: "", // Possible values: "1 kg", "1 piéce"
      price: 0,
      image: "",
      quantity: 0,
    };

    // Update the state by adding the new item to the items array
    setOrder((prevOrder) => ({
      ...prevOrder, // Spread the previous state
      items: [...prevOrder.items, newItem], // Add the new item to the items array
    }));
  };
  const submit = async () => {
    if (!user) {
      setIsConnected(true);
      return false;
    }
    const allValid = order.items.every(
      (item) =>
        item.type.trim() !== "" &&
        item.price > 0 &&
        item.image.trim() !== "" &&
        item.quantity > 0
    );

    if (allValid) {
      alert("All items are valid!");
    } else {
      alert("Some items are missing required information.");
      return false;
    }
    const phoneRegex = /^[2459]\d{7}$/;
    if (!phoneRegex.test(order.clientPhoneNumber)) {
      alert("Please enter a valid phone number.");
      return false;
    }
    order.totalAmount = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    try {
      const response = await axios.post(
        `http://localhost:3000/api/shop/${id}/orders`,
        order
      );

      alert("Order added successfully:");
      console.log(response.data);
    } catch (error) {
      alert("Error adding order");
      throw error;
    }
  };
  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/shop/${id}`
        );
        setShopData(response.data.articles); // Set the house state with the fetched data
      } catch (err) {
        console.log(err);
      }
    };

    fetchHouse(); // Call the function to fetch house details on component mount
  }, [id]);
  return (
    <div className="flex justify-center w-full h-screen bg-[#f2f2f2]">
      <Link className="absolute flex items-center gap-1 top-4 left-8" to={"/"}>
        <img className="w-7" src={dyari} />
        <h1 className="text-2xl font-medium text-amber-800">Dyari</h1>
      </Link>
      {showArticles.display && (
        <div className="absolute flex justify-center items-center gap-1 inset-0 ">
          <div className="grid w-1/3 grid-cols-2 p-8 gap-3 bg-white border border-black">
            {shopData.map((item, index) => (
              <img
                className="w-full h-72 cursor-pointer"
                key={index}
                onClick={() => {
                  setShowArticles(false);
                  updateItem(item, showArticles.item);
                }}
                src={item.image}
              />
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-y-3 h-fit bg-white shadow-lg rounded-md pl-8 pr-8 pb-6 pt-4 mt-24">
        {order.items.map((item, index) => (
          <div className="flex flex-col" key={index}>
            <div className="flex flex-col">
              <div className="flex items-center space-x-[2px] mb-1">
                <label className="text-[12px] font-medium text-[#606770]">
                  Select article
                </label>
                <span className="text-gray-500 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0zM12 8v4m0 4h.01"
                    />
                  </svg>
                </span>
              </div>
              <img
                className="w-48 bg-slate-100 cursor-pointer"
                onClick={() => handleClick(index)}
                src={item.image ? item.image : biscuit50}
              />
            </div>
            <div className="flex justify-between">
              <div>
                <div className="flex items-center space-x-[2px] mt-1">
                  <label className="text-[12px] font-medium text-[#606770]">
                    Quantité
                  </label>
                  <span className="text-gray-500 cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0zM12 8v4m0 4h.01"
                      />
                    </svg>
                  </span>
                </div>
                {item.type && item.type == "kg" && (
                  <div className="grid grid-cols-2 gap-1">
                    <div className="flex items-center gap-x-[2px] pl-2 pr-1 py-[2px] border rounded-full">
                      <h1 className="text-[13px]">0.5 Kg</h1>
                      <input
                        type="radio"
                        name={`quantite${index + 1}`}
                        onChange={() => updateQuantity(0.5, index)}
                      />
                    </div>
                    <div className="flex items-center gap-x-1 pl-2 pr-1 py-[2px] border rounded-full">
                      <h1 className="text-[13px]">1.0 Kg</h1>
                      <input
                        type="radio"
                        name={`quantite${index + 1}`}
                        onChange={() => updateQuantity(1, index)}
                      />
                    </div>

                    <div className="flex items-center gap-x-[2px] pl-2 pr-1 py-[2px] border rounded-full">
                      <h1 className="text-[13px]">2.0 Kg</h1>
                      <input
                        type="radio"
                        name={`quantite${index + 1}`}
                        onChange={() => updateQuantity(2, index)}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        className="w-16 border rounded-full pl-[10px] text-[13px]"
                        placeholder="à choix"
                      />
                    </div>
                  </div>
                )}
                {item.type && item.type == "piéce" && (
                  <div className="grid grid-cols-2 gap-1">
                    <div className="flex items-center gap-x-[2px] pl-2 pr-1 py-[2px] border rounded-full">
                      <h1 className="text-[13px]">1 piéce</h1>
                      <input
                        type="radio"
                        name={`quantite${index + 1}`}
                        onChange={() => updateQuantity(0.5, index)}
                      />
                    </div>
                    <div className="flex items-center gap-x-1 pl-2 pr-1 py-[2px] border rounded-full">
                      <h1 className="text-[13px]">2 piéce</h1>
                      <input
                        type="radio"
                        name={`quantite${index + 1}`}
                        onChange={() => updateQuantity(1, index)}
                      />
                    </div>

                    <div className="flex items-center gap-x-[2px] pl-2 pr-1 py-[2px] border rounded-full">
                      <h1 className="text-[13px]">3 piéce</h1>
                      <input
                        type="radio"
                        name={`quantite${index + 1}`}
                        onChange={() => updateQuantity(2, index)}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        className="w-[71px] border rounded-full py-[1px] pl-[10px] text-[13px]"
                        placeholder="à choix"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-[2px] mt-1">
                  <label className="text-[12px] font-medium text-[#606770]">
                    Prix
                  </label>
                  <span className="text-gray-500 cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0zM12 8v4m0 4h.01"
                      />
                    </svg>
                  </span>
                </div>
                {item.quantity && (
                  <h1 className="text-[14px]">
                    {item.price * item.quantity} dt
                  </h1>
                )}
              </div>
            </div>
          </div>
        ))}
        <div>
          <button
            className="w-full py-[2px] text-[13px] border border-gray-500 rounded-full"
            onClick={() => handleAddItem()}
          >
            Ajouter un autre article
          </button>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-[2px] mt-1">
            <label className="text-[12px] font-medium text-[#606770]">
              Prix totale
            </label>
            <span className="text-gray-500 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0zM12 8v4m0 4h.01"
                />
              </svg>
            </span>
          </div>
          <h1>
            {order.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            )}{" "}
            dt
          </h1>
        </div>
        <div className="flex flex-col gap-y-2">
          <div>
            <input
              type="text"
              placeholder="Votre numero de telephone"
              value={order.clientPhoneNumber}
              onChange={handleInputChange}
              required
              className="w-full rounded-[5px] border border-gray-400 px-4 py-1 text-sm"
            />
          </div>
          <button
            className="px-3 py-[6px] rounded-md bg-blue-600 text-white text-sm font-medium"
            onClick={() => submit()}
          >
            Passez votre commande
          </button>
        </div>
      </div>
      {isConnected && (
        <div className="absolute inset-0 flex flex-col justify-center items-center w-full h-screen bg-[#f5f5f5] gap-6">
          <div className="w-fit h-fit bg-white">
            <h1 className=" text-amber-600">
              Se connecter en mode <span className="font-semibold">Client</span>{" "}
              :
            </h1>

            <div className="w-[26%] flex flex-col gap-y-5 ">
              <div className="bg-white  rounded-md shadow-md hover:bg-gray-100 cursor-pointer">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;

import React from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const OrderUser = ({ order, index }) => {
  return (
    <div className="w-full border rounded-[4px] p-2 border-gray-300">
      <div className="flex justify-between items-center">
        <div className="">
          <h1 className="text-sm font-medium">Commande numero : {index} </h1>
          <h1 className="text-sm text-gray-600">
            Order Date: {dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")}
          </h1>
        </div>
        <h1
          className={`text-sm font-medium rounded py-1 px-3 border ${
            order.orderState == "accepted"
              ? "bg-green-100 text-green-700"
              : order.orderState === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.orderState}
        </h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {order?.orderItems.map((item, idx) => (
          <div className="p-3" key={idx}>
            <div className="relative group">
              <img
                src={item.articleId.articleImage}
                className="w-full aspect-[11/16]"
                alt="Product"
              />
              <div className="absolute top-0 right-0 left-0 h-8 p-1 bg-white border opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                <p className="text-center text-sm">
                  {item.articleId.articlePrice} dt par{" "}
                  {item.articleId.articleType}
                </p>
              </div>
            </div>
            {/* <div className="border-l-2 border-gray-400 h-32 mx-2"></div> */}
            <div>
              <h1 className="text-sm">
                quantité : {item.quantity} {item.articleId.articleType}
              </h1>
              <h1 className="text-sm">
                Prix totale : {item.quantity * item.articleId.articlePrice} dt
              </h1>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end pl-3 pr-1 border-t border-gray-300 py-2">
        <div>
          <div className="flex items-center gap-1">
            <span className="text-sm">Shop :</span>
            {order?.shopId ? (
              <Link
              className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200 text-sm"
              to={`/insideshop/${order.shopId?._id}`}
              >
              {order.shopId?.name} {order.shopId?.lastName}
            </Link>) : (
              <span className="text-sm underline">Shop deleted</span>
            )
            }
          </div>
          <h1 className="text-sm">Date de besoin : <span className="text-red-500">{dayjs(order.userNeededDate).format("DD/MM/YYYY") || "DD/MM/YYYY"}</span></h1>
          <h1 className="text-sm">
            Prix totale : {order?.orderTotalAmount} dt
          </h1>
        </div>
      </div>
    </div>
  );
};

export default OrderUser;

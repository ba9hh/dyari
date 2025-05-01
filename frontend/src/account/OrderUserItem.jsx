import React from "react";

const OrderUserItem = ({ order, index }) => {
  return (
    <div className="w-full border rounded-[4px] p-2">
      <div className="flex justify-between items-center">
        <h1 className="text-sm font-medium">Commande numero : {index}</h1>
        <h1
          className={`text-sm font-medium ${
            order.state == "accepté"
              ? "text-green-600"
              : order.state === "refusé"
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          {order.state}
        </h1>
      </div>
      <div className="grid grid-cols-3">
        {order.items.map((item, index) => (
          <div className="flex p-3" key={index}>
            <img src={item.image} className="w-24 h-32" />
            <div className="border-l-2 border-gray-400 h-32 mx-2"></div>
            <div>
              <h1 className="text-[13px] font-medium">
                Quantité : {item.quantity} {item.type}
              </h1>
              <h1 className="text-[13px] font-medium">
                Prix : {item.quantity * item.price} dt
              </h1>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between pl-3 pr-1">
        <h1 className="text-sm">Prix totale : {order.totalAmount} dt</h1>
        <h1 className="text-sm">
          Shop : {order.shopName} {order.shopLastName}
        </h1>
      </div>
    </div>
  );
};

export default OrderUserItem;

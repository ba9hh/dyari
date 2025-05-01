import React from 'react'
import { CheckCircle, XCircle } from "lucide-react";

const OrderShopItem = ({ order, index, userId, updateOrderState }) => {
    return (
        <div className="w-full border rounded-[4px] p-2">
          {/* Order Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-sm font-medium">Commande numero : {index}</h1>
            {order.state === "en attente" ? (
              <div className="flex gap-2">
                <h1>(Veuillez appeler le client avant de confirmer.)</h1>
                <button
                  className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-green-600 transition duration-300 flex items-center gap-1"
                  onClick={() => updateOrderState(userId, order.client, order._id, "accepté")}
                >
                  <CheckCircle size={18} />
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-red-600 transition duration-300 flex items-center gap-1"
                  onClick={() => updateOrderState(userId, order.client, order._id, "refusé")}
                >
                  <XCircle size={18} />
                </button>
              </div>
            ) : (
              <h1 className={`text-sm font-medium ${order.state=="accepté"?"text-green-600":"text-red-600"}`}>{order.state}</h1>
            )}
          </div>
    
          {/* Order Items */}
          <div className="grid grid-cols-3">
            {order.items.map((item, idx) => (
              <div className="flex p-3" key={idx}>
                <img src={item.image} className="w-24 h-32" alt="Product" />
                <div className="border-l-2 border-gray-400 h-32 mx-2"></div>
                <div>
                  <h1 className="text-[13px] font-medium">Quantité : {item.quantity} {item.type}</h1>
                  <h1 className="text-[13px] font-medium">Prix : {item.quantity * item.price} dt</h1>
                </div>
              </div>
            ))}
          </div>
    
          {/* Order Footer */}
          <div className="flex justify-between pl-3 pr-1">
            <h1 className="text-sm">Prix totale : {order.totalAmount} dt</h1>
            <h1 className="text-sm">
              Client : {order.clientName} {order.clientLastName} / {order.clientPhoneNumber}
            </h1>
          </div>
        </div>
      );
}

export default OrderShopItem
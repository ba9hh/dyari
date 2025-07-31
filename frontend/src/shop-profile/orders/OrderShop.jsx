import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import dayjs from "dayjs";

const OrderShop = ({ order, index }) => {
  const [currentState, setCurrentState] = useState(order.orderState);
  const updateOrderState = async (newState) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/order/${order._id}/state`,
        { orderState: newState }
      );
      console.log("Order updated:", response.data);
      setCurrentState(newState);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  const handleStateChange = (newState) => {
    // call your backend here to update the state
    console.log("New state:", newState);
    setCurrentState(newState); // assuming you're using a state hook
  };
  return (
    <div className="w-full border rounded-[4px] p-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-sm font-medium">Commande numero : {index}</h1>
          <h1 className="text-sm text-gray-600">
            Order Date: {dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")}
          </h1>
        </div>
        {currentState === "pending" ? (
          <div className="flex gap-2">
            <h1 className="text-sm">
              (Veuillez appeler le client avant de confirmer.)
            </h1>
            <button
              className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-green-600 transition duration-300 flex items-center gap-1"
              onClick={() => updateOrderState("accepted")}
            >
              <CheckCircle size={18} />
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-red-600 transition duration-300 flex items-center gap-1"
              onClick={() => updateOrderState("rejected")}
            >
              <XCircle size={18} />
            </button>
          </div>
        ) : (
          <h1
            className={`text-sm font-medium rounded py-1 px-3 border ${
              currentState == "accepted"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {currentState}
          </h1>
        )}
      </div>

      {/* Order Items */}
      <div className="grid grid-cols-4 gap-4">
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

      {/* Order Footer */}
      <div className="flex justify-end py-2 px-1 border-t border-gray-300">
        <div>
          <h1 className="text-sm">Client : {order?.userId.name || "deleted acount"}</h1>
          <h1 className="text-sm">
            {order?.userPhoneNumber? `Numero de client : ${order?.userPhoneNumber}` : ""}
          </h1>
          <h1 className="text-sm">Date de besoin : <span className="text-red-500">{dayjs(order?.userNeededDate).format("DD/MM/YYYY") || "DD/MM/YYYY"}</span></h1>
          <h1 className="text-sm">
            Prix totale : {order?.orderTotalAmount} dt
          </h1>
        </div>
      </div>
    </div>
  );
};

export default OrderShop;

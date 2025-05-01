import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthProvider";

const Test = () => {
  const { user } = useContext(AuthContext);
  const [editedName, setEditedName] = useState(user?.name || "");

  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };

  const updateName = async () => {
    console.log("what?");

    try {
      console.log("sir");
      const response = await axios.put(
        `http://localhost:3000/api/shop/update-name/${user._id}`,
        { newName: editedName }
      );
      console.log("shit");
      alert("done");
    } catch (error) {
      console.log("is the problem?");
      console.error(
        "Error updating localisation:",
        error.response ? error.response.data : error.message
      );
    }
  };
  return (
    <div>
      <input
        type="text"
        name="name"
        value={editedName}
        placeholder="Prénom"
        onChange={handleNameChange}
        required
        className="w-1/2 rounded-[5px] border border-gray-400 px-[10px] py-[8px] text-[15px]"
      />
      <div className="flex flex-1 justify-end items-center">
        <button
          disabled={editedName === user?.name}
          className={`px-[32px] font-semibold text-[15px] h-[30px] rounded-[6px] ${
            editedName === user?.name ? "bg-gray-400" : "bg-blue-600 text-white"
          }`}
          onClick={updateName}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
};

export default Test;

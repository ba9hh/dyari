import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { TextField, IconButton } from "@mui/material";
import axios from "axios";
const GeneralAboutUser = ({userId}) => {
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [user, setUser] = useState([]);
  useEffect(() => {
    const fetchShopInformation = async () => {
      try {
        const response = await axios.get(
          `https://dyari.onrender.com/api/user/${userId}/information`
        );
        setUser(response.data);
        setName(response.data.name);
      } catch (error) {
        console.error("Error fetching shop information:", error);
      }
    };
    fetchShopInformation();
  }, [userId]);
  const handleSave = async () => {
    if (editing === "name") {
      //   await saveField("name", name);
    }
    setEditing(null);
  };
  const handleCancel = () => {
    if (editing === "name") setName(user.name);

    setEditing(null);
  };
  const isUnchanged = () => {
    if (editing === "name") return name === user.name;
    return true;
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={editing !== "name"}
          fullWidth
        />
        {editing !== "name" ? (
          <IconButton onClick={() => setEditing("name")} sx={{ ml: 1 }}>
            <EditIcon />
          </IconButton>
        ) : (
          <div className="flex flex-row gap-2 ml-2">
            <IconButton
              onClick={handleSave}
              disabled={isUnchanged() || name.trim() === ""}
              color="primary"
            >
              <SaveIcon />
            </IconButton>
            <IconButton onClick={handleCancel} color="error">
              <CancelIcon />
            </IconButton>
          </div>
        )}
      </div>
      <div className="flex">
        <TextField
          label="email"
          value={user.email || ""}
          disabled={true}
          fullWidth
        />
      </div>
    </div>
  );
};

export default GeneralAboutUser;

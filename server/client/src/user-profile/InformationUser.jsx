import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider";
import axios from "axios";
import pdp from "../assets/pdp.png";
import Button from "@mui/material/Button";
import {
  Tabs,
  Tab,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Stack,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const InformationUser = ({ userId, activeTab, handleChange }) => {
  const { handleLogout } = useContext(AuthContext);
  const [user, setUser] = useState([]);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [chosenAvatar, setChosenAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const response = await axios.get(
          `https://dyari.onrender.com/api/user/${userId}/information`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching shop information:", error);
      }
    };
    fetchUserInformation();
  }, []);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFile(f);
    setChosenAvatar(null);
    setPreview(url);
  };

  const pickAvatar = (url) => {
    setChosenAvatar(url);
    setFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };
  const handleUpdate = async () => {
    setLoading(true);
    try {
      if (file) {
        const imgFormData = new FormData();
        imgFormData.append("image", file);

        const uploadRes = await axios.post(
          "https://dyari.onrender.com/upload",
          imgFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const uploadedImageUrl = uploadRes.data.url;

        await axios.put(
          `https://dyari.onrender.com/api/user/${userId}/profile-picture`,
          { newProfilePicture: uploadedImageUrl }
        );
      } else if (chosenAvatar) {
        await axios.put(
          `https://dyari.onrender.com/api/user/${userId}/profile-picture`,
          { newProfilePicture: chosenAvatar }
        );
      }

      handleClose();
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative w-full sm:w-2/3 bg-white shadow-md rounded-md">
      <div className="flex gap-2 absolute top-4 right-2">
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{
            textTransform: "none",
          }}
          component={Link}
          to="settings"
        >
          Settings
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{
            textTransform: "none",
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
      <div className="h-28 bg-gradient-to-t from-gray-300 to-transparent flex justify-center items-center"></div>
      <div className="flex justify-center -mt-6">
        <div className="flex flex-col items-center gap-1 mb-4">
          <div className="relative inline-block group w-16 h-16">
            <button
              type="button"
              onClick={handleOpen}
              className="absolute bottom-0 -right-2 hover:bg-gray-100 bg-white rounded-full px-1 pb-1 shadow-md transition-opacity focus:outline-none"
            >
              <EditIcon sx={{ fontSize: 18, color: "#4B5563" }} />
            </button>
            <img
              className="w-full h-full border-2 p-1 rounded-full bg-white object-cover"
              src={user ? user.profilePicture : pdp}
              alt="Profile"
            />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-lg">
              {user ? user.name : ""} {user ? user.lastName : ""}
            </h1>
            <h1 className="text-sm text-gray-400">{user ? user.email : ""}</h1>
          </div>
        </div>
      </div>
      <Box sx={{ borderTop: 1, borderColor: "divider", width: "100%" }}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="standard"
          sx={{ mb: 0, px: 2 }}
          TabIndicatorProps={{
            style: {
              height: "4px",
            },
          }}
          centered
        >
          <Tab
            label="Orders"
            value="orders"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          />
          <Tab
            label="Liked shops"
            value="likedShops"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          />
          <Tab
            label="Rated shops"
            value="ratedShops"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          />
        </Tabs>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Profile Picture</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <div className="flex justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <Avatar
                  src={user ? user.profilePicture : pdp}
                  sx={{ width: 128, height: 128 }}
                />
              )}
            </div>
            <Button variant="outlined" component="label" sx={{ px: 12 }}>
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={loading || (!file && !chosenAvatar)}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Update"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InformationUser;

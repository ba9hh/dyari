import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider";
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
import ReactStars from "react-rating-stars-component";
import pdp from "../assets/pdp.png";
import axios from "axios";
import boys from "../data/boys";
import girls from "../data/girls";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const InformationShop = ({ shopId, activeTab, handleChange }) => {
  const { handleLogout } = useContext(AuthContext);
  const [user, setUser] = useState([]);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [chosenAvatar, setChosenAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // const shopId = "685abc46ebb4bce0fb944f4d";
  useEffect(() => {
    const fetchShopInformation = async () => {
      try {
        const response = await axios.get(
          `https://dyari.onrender.com/api/shop/${shopId}/information`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching shop information:", error);
      }
    };
    fetchShopInformation();
  }, []);
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

        await axios.put(`https://dyari.onrender.com/api/shop/profile-picture`, {
          newProfilePicture: uploadedImageUrl,
        });
        setUser((prev) => ({ ...prev, profilePicture: uploadedImageUrl }));
      } else if (chosenAvatar) {
        await axios.put(`https://dyari.onrender.com/api/shop/profile-picture`, {
          newProfilePicture: chosenAvatar,
        });
        setUser((prev) => ({ ...prev, profilePicture: chosenAvatar }));
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

      {/* <div className="absolute top-0 left-0 flex items-center px-1">
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
        </div> */}

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
            label="Articles"
            value="articles"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          />
          <Tab
            label="Orders"
            value="orders"
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
              ) : chosenAvatar ? (
                <Avatar src={chosenAvatar} sx={{ width: 128, height: 128 }} />
              ) : (
                <Avatar
                  src={user ? user.profilePicture : pdp}
                  sx={{ width: 128, height: 128 }}
                />
              )}
            </div>
            <Button variant="outlined" component="label">
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>

            {/* Or choose from avatars */}
            <div>
              <p className="mb-2 text-sm text-gray-600">Or pick an avatar:</p>
              <Stack direction="row" spacing={1}>
                {(user.gender === "Homme" ? boys : girls).map((url) => (
                  <Avatar
                    key={url.alt}
                    src={url.src}
                    onClick={() => pickAvatar(url.src)}
                    sx={{
                      cursor: "pointer",
                      border:
                        user?.profilePicture === url.src
                          ? "2px solid #1976d2"
                          : "2px solid transparent",
                    }}
                  />
                ))}
              </Stack>
            </div>
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

export default InformationShop;

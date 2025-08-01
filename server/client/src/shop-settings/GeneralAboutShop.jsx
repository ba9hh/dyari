import { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  IconButton,
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import cities from "../data/cities";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
const GeneralAboutShop = ({ shopId }) => {
  const [user, setUser] = useState([]);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [gender, setGender] = useState("");
  const [speciality, setSpeciality] = useState([]);
  const specialties = ["sales", "sucres", "gateaux", "biscuit"];
  const { t } = useTranslation();

  useEffect(() => {
    const fetchShopInformation = async () => {
      try {
        const response = await axios.get(
          `https://dyari.onrender.com/api/shop/${shopId}/information`
        );
        setUser(response.data);
        setName(response.data.name);
        setLastName(response.data.lastName);
        setLocalisation(response.data.localisation);
        setGender(response.data.gender);
        setSpeciality(response.data.speciality);
      } catch (error) {
        console.error("Error fetching shop information:", error);
      }
    };
    fetchShopInformation();
  }, [shopId]);
  const saveField = async (field, value) => {
    await axios.put(`https://dyari.onrender.com/api/shop/information`, {
      [field]: value,
    });
    if (
      ["name", "lastName", "localisation", "gender", "speciality"].includes(
        field
      )
    ) {
      setUser((prev) => ({ ...prev, [field]: value }));
    }
  };
  const [editing, setEditing] = useState(null);

  const handleSave = async () => {
    if (editing === "name") {
      await saveField("name", name);
    } else if (editing === "lastName") {
      await saveField("lastName", lastName);
    } else if (editing === "localisation") {
      await saveField("localisation", localisation);
    } else if (editing === "gender") {
      await saveField("gender", gender);
    } else if (editing === "speciality") {
      await saveField("speciality", speciality);
    }
    setEditing(null);
  };
  const handleCancel = () => {
    if (editing === "name") setName(user.name);
    if (editing === "lastName") setLastName(user.lastName);
    if (editing === "localisation") setLocalisation(user.localisation);
    if (editing === "gender") setGender(user.gender);
    if (editing === "speciality") setSpeciality(user.speciality);

    setEditing(null);
  };
  const isUnchanged = () => {
    if (editing === "name") return name === user.name;
    if (editing === "lastName") return lastName === user.lastName;
    if (editing === "localisation") return localisation === user.localisation;
    if (editing === "gender") return gender === user.gender;
    if (editing === "speciality")
      return JSON.stringify(speciality) === JSON.stringify(user.speciality);

    return true;
  };
  return (
    <>
      <Typography
        variant="h6"
        align="center"
        gutterBottom
      >
        General Information
      </Typography>
      <div className="flex flex-col gap-6 w-max-full mx-6 mt-4">
        <div className="flex gap-4">
          <div className="w-1/2 sm:w-1/2 flex items-center">
            <TextField
              label="First Name"
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
          <div className="w-1/2 sm:w-1/2 flex items-center">
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={editing !== "lastName"}
              fullWidth
            />
            {editing !== "lastName" ? (
              <IconButton onClick={() => setEditing("lastName")} sx={{ ml: 1 }}>
                <EditIcon />
              </IconButton>
            ) : (
              <div className="flex flex-row gap-2 ml-2">
                <IconButton
                  onClick={handleSave}
                  disabled={isUnchanged() || lastName.trim() === ""}
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
        </div>
        <div className="flex gap-4">
          <div className="w-1/2 sm:w-1/2 flex items-center">
            <FormControl fullWidth disabled={editing !== "localisation"}>
              <InputLabel id="localisation-label">Localisation</InputLabel>
              <Select
                value={localisation}
                label="localisation"
                onChange={(e) => setLocalisation(e.target.value)}
                disabled={editing !== "localisation"}
                fullWidth
              >
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {t(`homepage.cities.${city}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {editing !== "localisation" ? (
              <IconButton
                onClick={() => setEditing("localisation")}
                sx={{ ml: 1 }}
              >
                <EditIcon />
              </IconButton>
            ) : (
              <Stack direction="row" spacing={1} sx={{ ml: 1 }}>
                <IconButton
                  onClick={handleSave}
                  disabled={isUnchanged()}
                  color="primary"
                >
                  <SaveIcon />
                </IconButton>
                <IconButton onClick={handleCancel} color="error">
                  <CancelIcon />
                </IconButton>
              </Stack>
            )}
          </div>
          <div className="w-1/2 sm:w-1/2 flex items-center">
            <FormControl fullWidth disabled={editing !== "gender"}>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                value={gender}
                label="gender"
                onChange={(e) => setGender(e.target.value)}
                disabled={editing !== "gender"}
                fullWidth
              >
                <MenuItem value="Homme">Homme</MenuItem>
                <MenuItem value="Femme">Femme</MenuItem>
              </Select>
            </FormControl>

            {editing !== "gender" ? (
              <IconButton onClick={() => setEditing("gender")} sx={{ ml: 1 }}>
                <EditIcon />
              </IconButton>
            ) : (
              <Stack direction="row" spacing={1} sx={{ ml: 1 }}>
                <IconButton
                  onClick={handleSave}
                  disabled={isUnchanged()}
                  color="primary"
                >
                  <SaveIcon />
                </IconButton>
                <IconButton onClick={handleCancel} color="error">
                  <CancelIcon />
                </IconButton>
              </Stack>
            )}
          </div>
        </div>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
            paddingLeft: "11px",
          }}
        >
          {specialties.map((item) => (
            <FormControlLabel
              key={item}
              label={item}
              control={
                <Checkbox
                  checked={speciality.includes(item)}
                  onChange={() => {
                    if (!editing) return; // disable editing unless active
                    if (speciality.includes(item)) {
                      setSpeciality(speciality.filter((i) => i !== item));
                    } else {
                      setSpeciality([...speciality, item]);
                    }
                  }}
                  color="primary"
                />
              }
              sx={{
                width: "fit-content",
                paddingRight: "12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          ))}

          {editing !== "speciality" ? (
            <IconButton onClick={() => setEditing("speciality")}>
              <EditIcon />
            </IconButton>
          ) : (
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={handleSave}
                disabled={isUnchanged() || speciality.length === 0}
                color="primary"
              >
                <SaveIcon />
              </IconButton>
              <IconButton onClick={handleCancel} color="error">
                <CancelIcon />
              </IconButton>
            </Stack>
          )}
        </Box>
      </div>
    </>
  );
};

export default GeneralAboutShop;

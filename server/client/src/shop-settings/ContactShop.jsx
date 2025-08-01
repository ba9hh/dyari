import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

const fieldConfig = {
  facebook: {
    label: "Facebook",
    validate: (v) =>
      /^https:\/\/(www\.)?facebook\.com\/[A-Za-z0-9\.]+/.test(v),
    helperText: "Must be a full facebook.com URL (https://www.facebook.com/...)",
  },
  instagram: {
    label: "Instagram",
    validate: (v) =>
      /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_\.]+/.test(v),
    helperText: "Must be a full instagram.com URL",
  },
  tiktok: {
    label: "TikTok",
    validate: (v) =>
      /^https:\/\/(www\.)?tiktok\.com\/@[\w\.]+/.test(v),
    helperText: "Must be a full tiktok.com URL",
  },
  youtube: {
    label: "YouTube",
    validate: (v) =>
      /^https:\/\/(www\.)?youtube\.com\/(channel|c)\/[\w-]+/.test(v),
    helperText: "Must be a valid YouTube channel URL",
  },
  whatsapp: {
    label: "WhatsApp",
    validate: (v) => /^[259]\d{7}$/.test(v),
    helperText: "8 digits, starting with 2, 5, or 9",
  },
  locationExact: {
    label: "Exact Location",
    validate: (v) => v.trim().length > 0,
    helperText: "",
  },
};

const ContactShop = ({ shopId }) => {
  const [values, setValues] = useState(
    Object.fromEntries(Object.keys(fieldConfig).map((f) => [f, ""]))
  );
  const [original, setOriginal] = useState({ ...values });
  const [editing, setEditing] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get(`https://dyari.onrender.com/api/shop/${shopId}/additional-info`)
      .then((res) => {
        const data = res.data.data || {};
        const newVals = { ...values };
        Object.keys(fieldConfig).forEach((f) => {
          newVals[f] = data[f] || "";
        });
        setValues(newVals);
        setOriginal(newVals);
      })
      .catch(console.error);
  }, [shopId]);

  const handleChange = (field) => (e) => {
    const v = e.target.value;
    setValues((prev) => ({ ...prev, [field]: v }));
    // re-validate on change
    const ok = fieldConfig[field].validate(v);
    setErrors((prev) => ({ ...prev, [field]: ok ? "" : fieldConfig[field].helperText }));
  };

  const saveField = async (field) => {
  try {
    const updatePayload = { [field]: values[field] };

    const response = await axios.put(
      `https://dyari.onrender.com/api/shop/${shopId}/additional-info`,
      updatePayload
    );

    // Update local state with saved data
    const updated = response.data || {};
    setOriginal((prev) => ({ ...prev, [field]: updated[field] || "" }));
    setValues((prev) => ({ ...prev, [field]: updated[field] || "" }));
    setEditing(null);
  } catch (err) {
    console.error("Failed to save field:", err);
    alert("Error saving the field. Please try again.");
  }
};

 const deleteField = async (field) => {
  try {
    await axios.delete(`https://dyari.onrender.com/api/shop/${shopId}/additional-info`, {
      data: { field }, 
    });

    setValues((v) => ({ ...v, [field]: "" }));
    setOriginal((o) => ({ ...o, [field]: "" }));
  } catch (err) {
    console.error("Failed to delete field:", err);
    alert("Error deleting the field. Please try again.");
  }
};

  const isUnchanged = (field) =>
    values[field] === original[field];

  return (
    <div className="mt-4 border px-6 py-4">
      <Typography variant="h6" align="center" gutterBottom>
        Additional Information
      </Typography>

      <div className="space-y-6">
        {Object.entries(fieldConfig).map(([field, cfg]) => {
          const val = values[field];
          const hasOriginal = original[field]?.trim() !== "";
          const isEditing = editing === field;
          const errorMsg = errors[field] || "";
          const valid = !errorMsg && val.trim() !== "";

          return (
            <div key={field} className="flex items-center gap-2">
              <TextField
                label={cfg.label}
                value={val}
                onChange={handleChange(field)}
                disabled={!isEditing}
                error={!!errorMsg}
                helperText={errorMsg}
                fullWidth
              />

              {/* Delete button (only when not editing and a value exists) */}
              {!isEditing && hasOriginal && (
                <Tooltip title={`Delete ${cfg.label}`}>
                  <IconButton
                    onClick={() => deleteField(field)}
                    color="warning"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}

              {/* Edit / Save / Cancel */}
              {!isEditing ? (
                <IconButton onClick={() => setEditing(field)}>
                  <EditIcon />
                </IconButton>
              ) : (
                <>
                  <IconButton
                    onClick={() => saveField(field)}
                    disabled={!valid || isUnchanged(field)}
                    color="primary"
                  >
                    <SaveIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setValues((v) => ({
                        ...v,
                        [field]: original[field],
                      }));
                      setErrors((e) => ({ ...e, [field]: "" }));
                      setEditing(null);
                    }}
                    color="error"
                  >
                    <CancelIcon />
                  </IconButton>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactShop;

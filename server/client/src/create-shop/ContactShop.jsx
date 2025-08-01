import axios from "axios";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography } from "@mui/material";
const validationRules = {
  facebook: {
    pattern: {
      value: /^https:\/\/(www\.)?facebook\.com\/[A-Za-z0-9\.]+$/,
      message: "Must be a full facebook.com URL (https://www.facebook.com/...)",
    },
  },
  instagram: {
    pattern: {
      value: /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_\.]+$/,
      message: "Must be a full instagram.com URL (https://www.instagram.com/...)",
    },
  },
  tiktok: {
    pattern: {
      value: /^https:\/\/(www\.)?tiktok\.com\/@[A-Za-z0-9_\.]+$/,
      message: "Must be a full tiktok.com URL (https://www.tiktok.com/@...)",
    },
  },
  youtube: {
    pattern: {
      value: /^https:\/\/(www\.)?youtube\.com\/(channel|c)\/[A-Za-z0-9_-]+$/,
      message: "Must be a valid YouTube channel URL (https://www.youtube.com/channel/... or /c/...)",
    },
  },
  whatsapp: {
    pattern: {
      value: /^[259]\d{7}$/, // starts with 2,5,9 and total 8 digits
      message: "8 digits, starting with 2, 5, or 9",
    },
  },
};
const ContactShop = ({ onDone ,setFormData}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      facebook: "",
      instagram: "",
      tiktok:"",
      youtube:"",
      whatsapp: "",
      locationExact: "",
    },
  });

  const onSubmit = async (data) => {
    setFormData((prev) => ({
      ...prev,
      additional: {
        ...prev.additional,
        ...data,
      },
      }));
      onDone();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: "100%", bgcolor: "white", p: 3, borderRadius: 2 }}
    >
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Additional Information
      </Typography>

      <Box mb={2}>
        <TextField
          fullWidth
          label="Facebook URL"
          variant="outlined"
          {...register("facebook", validationRules.facebook)}
          error={!!errors.facebook}
          helperText={errors.facebook?.message}
        />
      </Box>

      <Box mb={2}>
        <TextField
          fullWidth
          label="Instagram URL"
          variant="outlined"
          {...register("instagram", validationRules.instagram)}
          error={!!errors.instagram}
          helperText={errors.instagram?.message}
        />
      </Box>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Tiktok URL"
          variant="outlined"
          {...register("tiktok", validationRules.tiktok)}
          error={!!errors.instagram}
          helperText={errors.instagram?.message}
        />
      </Box>
      <Box mb={2}>
        <TextField
          fullWidth
          label="YouTube URL"
          variant="outlined"
          {...register("youtube", validationRules.youtube)}
          error={!!errors.instagram}
          helperText={errors.instagram?.message}
        />
      </Box>

      <Box mb={2}>
        <TextField
          fullWidth
          label="WhatsApp Number"
          variant="outlined"
          {...register("whatsapp", validationRules.whatsapp)}
          error={!!errors.whatsapp}
          helperText={errors.whatsapp?.message}
        />
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          label="Exact Location"
          variant="outlined"
          {...register("locationExact")}
          error={!!errors.locationExact}
          helperText={errors.locationExact?.message}
        />
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ py: 1 }}
      >
        Next
      </Button>
    </Box>
  );
};

export default ContactShop;

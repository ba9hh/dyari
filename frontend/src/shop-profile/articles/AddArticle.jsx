import { useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Dyari from "../../components/Dyari";
import { AuthContext } from "../../AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";

const AddArticle = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      title: "",
      type: "kg",
      price: "",
      image: null,
    },
  });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("image", file);
    let uploadedImageUrl = "";
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      uploadedImageUrl = response.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
    const payload = {
      shopId: user._id,
      articleTitle: data.title,
      articleType: data.type,
      articlePrice: data.price,
      articleImage: uploadedImageUrl,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/article",
        payload
      );
      toast.success("Article added successfully!");
      navigate("/account");
    } catch (error) {
      console.error("Error adding article:", error);
      toast.error("Failed to add article. Please try again.");
      return null;
    }
    setLoading(false);
  };

  const handleSaveAndAddAnother = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    let uploadedImageUrl = "";
    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      uploadedImageUrl = response.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
    const payload = {
      shopId: user._id,
      articleTitle: data.title,
      articleType: data.type,
      articlePrice: data.price,
      articleImage: uploadedImageUrl,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/article",
        payload
      );
      toast.success("Article added successfully!");
      reset();
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding article:", error);
      toast.error("Failed to add article. Please try again.");
    }
    setLoading(false);
  };

  if (!user) {
    navigate("/");
  } else if (user.role != "shop") {
    navigate("/");
  }
  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-white sm:bg-[#f5f5f5] pt-16 pb-8">
      <Dyari />
      <div className="bg-white px-10 py-6 rounded-md shadow-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ maxWidth: 500, margin: "auto" }}
        >
          <Typography variant="h5" gutterBottom>
            Add New Article
          </Typography>

          <Controller
            name="image"
            control={control}
            rules={{ required: "Image is required" }}
            render={({ field }) => (
              <div style={{ marginBottom: 20 }}>
                <Button variant="contained" component="label">
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFile(file);
                      field.onChange(file);
                      setImagePreview(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                </Button>
                {errors.image && (
                  <Typography color="error">{errors.image.message}</Typography>
                )}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      display: "block",
                      marginTop: 10,
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                )}
              </div>
            )}
          />

          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <TextField
                label="Title"
                fullWidth
                margin="normal"
                error={!!errors.title}
                helperText={errors.title?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select label="Type" {...field}>
                  <MenuItem value="kg">Kg</MenuItem>
                  <MenuItem value="piece">Piece</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="price"
            control={control}
            rules={{
              required: "Price is required",
              min: { value: 0.01, message: "Price must be greater than 0" },
            }}
            render={({ field }) => (
              <TextField
                label="Price"
                type="number"
                fullWidth
                margin="normal"
                inputProps={{ min: 0.01, step: 0.01 }}
                error={!!errors.price}
                helperText={errors.price?.message}
                {...field}
              />
            )}
          />

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={handleSubmit(handleSaveAndAddAnother)}
              fullWidth
              sx={{ flex: 1 }}
              disabled={!isValid || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save & Add Another"}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ flex: 1 }}
              disabled={!isValid || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default AddArticle;

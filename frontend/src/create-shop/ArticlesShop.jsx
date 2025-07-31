import React, { useState, useEffect, useContext } from "react";
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
import axios from "axios";

const ArticlesShop = ({ onDone, formData, setFormData }) => {
  const { handleSubmit, control, reset,formState: { errors }, } = useForm({
    defaultValues: {
      title: "",
      description: "",
      type: "kg",
      price: "",
      image: null,
    },
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true)
    setFormData((prev) => ({
      ...prev,
      articles: [...prev.articles, data],
    }));
    try {
      const response = await axios.post(
        "http://localhost:3000/api/create-verification",
        { email: formData.general.email }
      );
      onDone();
    } catch (error) {
      console.error(error);
    }finally{
      setLoading(false)
    }
  };
  const handleSaveAndAddAnother = (data) => {
    setLoading(true);
    setFormData((prev) => ({
      ...prev,
      articles: [...prev.articles, data],
    }));
    reset();
    setImagePreview(null);
    setLoading(false)
  };

  return (
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
                      setImagePreview(
                        file ? URL.createObjectURL(file) : null
                      );
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
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Save & Add Another"}
        </Button>
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
          fullWidth
          disabled={loading}
          sx={{ flex: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </Stack>
    </form>
  );
};

export default ArticlesShop;

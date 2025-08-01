import { useState, useEffect, useContext } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import Dyari from "../../components/Dyari";
import { AuthContext } from "../../AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateArticle = () => {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      title: "",
      type: "kg",
      price: "",
      image: null,
    },
  });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { articleId } = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing article
  useEffect(() => {
    if (!user) return;
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/article/${articleId}`);
        const art = res.data;
        // only the shop owner can update
        if (art.shopId !== user._id) {
          navigate('/');
          return;
        }
        reset({
          title: art.articleTitle,
          type: art.articleType,
          price: art.articlePrice,
          image: null,
        });
        setImagePreview(art.articleImage);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load article.");
        navigate('/account');
      }
    };
    fetchArticle();
  }, [articleId, reset, user, navigate]);

  if (!user || user.role !== "shop") {
    navigate("/");
    return null;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    let uploadedImageUrl = imagePreview;

    // If a new file is selected, upload it
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const uploadRes = await axios.post(
          "http://localhost:3000/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        uploadedImageUrl = uploadRes.data.url;
      } catch (err) {
        console.error("Error uploading image:", err);
        toast.error("Image upload failed.");
        setLoading(false);
        return;
      }
    }

    const payload = {
      shopId: user._id,
      articleTitle: data.title,
      articleType: data.type,
      articlePrice: data.price,
      articleImage: uploadedImageUrl,
    };

    try {
      await axios.put(
        `http://localhost:3000/api/article/${articleId}`,
        payload
      );
      toast.success("Article updated successfully!");
      navigate("/account");
    } catch (err) {
      console.error("Error updating article:", err);
      toast.error("Failed to update article.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-white sm:bg-[#f5f5f5] pt-16 pb-8">
      <Dyari />
      <div className="bg-white px-10 py-6 rounded-md shadow-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ maxWidth: 500, margin: "auto" }}
        >
          <Typography variant="h5" gutterBottom>
            Update Article
          </Typography>

          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <div style={{ marginBottom: 20 }}>
                <Button variant="contained" component="label">
                  {file ? "Change Image" : "Upload Image"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files[0];
                      setFile(f);
                      field.onChange(f);
                      setImagePreview(f ? URL.createObjectURL(f) : null);
                    }}
                  />
                </Button>
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
            render={({ field }) => (
              <TextField label="Title" fullWidth margin="normal" {...field} />
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>Unité de vente</InputLabel>
                <Select label="Unité de vente" {...field}>
                  <MenuItem value="kg">Kg</MenuItem>
                  <MenuItem value="piece">Piece</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                label="Prix"
                type="number"
                fullWidth
                margin="normal"
                inputProps={{ min: 0, step: 0.01 }}
                {...field}
              />
            )}
          />

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default UpdateArticle;

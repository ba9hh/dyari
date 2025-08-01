import { useState, useContext } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../AuthProvider";
import { Link } from "react-router-dom";
import Dyari from "../components/Dyari";
const ChangePassword = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const newPasswordValue = watch("newPassword");
  const { user } = useContext(AuthContext);
  if (!user || user?.role == "user") {
    navigate("/");
  }
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post("https://dyari.onrender.com/api/shop/update-password", {
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully!");
      navigate("/account");
    } catch (err) {
      console.error("Error changing password:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-[#f5f5f5] gap-y-4">
      <Dyari />
      <div className="w-[26%] flex flex-col gap-y-5 bg-white px-5 py-8 rounded-md shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ textAlign: "center" }}
          >
            Change Password
          </Typography>
          <Controller
            name="oldPassword"
            control={control}
            rules={{
              required: "Current password is required",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Current Password"
                type="password"
                fullWidth
                error={!!errors.oldPassword}
                helperText={errors.oldPassword?.message}
                margin="normal"
              />
            )}
          />

          <Controller
            name="newPassword"
            control={control}
            rules={{
              required: "New password is required",
              minLength: { value: 8, message: "Minimum 8 characters" },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message: "Include letters & numbers",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="New Password"
                type="password"
                fullWidth
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                margin="normal"
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Please confirm new password",
              validate: (value) =>
                value === newPasswordValue || "Passwords do not match",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirm New Password"
                type="password"
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                margin="normal"
              />
            )}
          />

          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

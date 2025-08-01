import { useState } from "react";
import axios from "axios";
import { TextField, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";

const ResetPassword = ({ onDone, email }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { newPassword: "" } });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/shop/reset-password", {
        email,
        newPassword: data.newPassword,
      });
      onDone();
    } catch (err) {
      console.error("Error resetting password:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Controller
        name="newPassword"
        control={control}
        rules={{
          required: "Password is required",
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
          />
        )}
      />
      <Button variant="contained" type="submit" disabled={loading} fullWidth sx={{ mt: 2 }}>
        {loading ? <CircularProgress size={24} /> : "Confirmer"}
      </Button>
    </form>
  );
};

export default ResetPassword;

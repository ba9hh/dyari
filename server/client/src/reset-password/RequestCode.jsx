import { useState } from "react";
import axios from "axios";
import { TextField, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";

const RequestCode = ({ onDone, setEmail }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "" },
  });
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://dyari.onrender.com/api/shop/check-email-and-create-verification",
        { email: data.email }
      );
      setEmail(data.email);
      onDone();
    } catch (err) {
      console.error("Error sending verification code:", err);
      if (err.response?.status === 404) {
        setServerError("This email does not exist.");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        rules={{
          required: "Email is required",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Enter a valid email address",
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            onChange={(e) => {
              field.onChange(e);
              setServerError("");
            }}
            label="Email"
            fullWidth
            error={!!errors.email || !!serverError}
            helperText={errors.email?.message || serverError}
          />
        )}
      />

      <Button type="submit" variant="contained" disabled={loading} fullWidth sx={{ mt: 2 }}>
        {loading ? <CircularProgress size={24} /> : "Continue"}
      </Button>
    </form>
  );
};

export default RequestCode;

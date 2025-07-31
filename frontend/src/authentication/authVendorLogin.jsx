import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider";
import { useForm, Controller } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Link as MuiLink,
  Typography,
  Box,
} from "@mui/material";
import Dyari from "../components/Dyari";
import axios from "axios";

const AuthVendorLogin = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: { email: "", password: "" },
  });
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleFieldChange = (onChange) => (e) => {
    if (loginError) setLoginError("");
    clearErrors();
    onChange(e);
  };
  const onSubmit = async (data) => {
    setLoginError("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        data,
        { withCredentials: true }
      );
      setUser(response.data.shop);
      navigate("/");
    } catch (err) {
      console.error("Login failed", err);
      setLoginError(
        err.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center w-full h-screen bg-white sm:bg-[#f5f5f5]">
        <Dyari />

        <form
          className="w-full sm:w-1/3 flex flex-col gap-y-5 bg-white px-10 py-8 sm:rounded-md sm:shadow-md"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box textAlign="center" mt={5}>
            <Typography variant="h5" fontWeight="bold">
              Sign in
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={1}>
              Welcome user, please sign in to continue
            </Typography>
          </Box>
          {loginError && (
            <Typography color="error" textAlign="center">
              {loginError}
            </Typography>
          )}

          <div className="flex flex-col gap-y-3">
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Adresse e-mail requise",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Adresse e-mail invalide",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="email"
                  label="Adresse e-mail"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  onChange={handleFieldChange(field.onChange)}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{ required: "Mot de passe requis" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Mot de passe"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  onChange={handleFieldChange(field.onChange)}
                />
              )}
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading || Boolean(loginError)}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>

          <MuiLink
            component={RouterLink}
            to="/forget-password"
            textAlign="center"
          >
            Mot de passe oublié ?
          </MuiLink>
        </form>
      </div>
    </>
  );
};

export default AuthVendorLogin;

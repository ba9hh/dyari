import { useState } from "react";
import {
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  Avatar,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import cities from "../data/cities";
import { toast } from "react-toastify";
const infoIcon = (
  <Box
    component="span"
    sx={{ color: "gray", cursor: "pointer", display: "inline-flex", ml: 0.5 }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0z" />
      <path d="M12 8v4m0 4h.01" />
    </svg>
  </Box>
);

const specialties = ["sales", "sucres", "gateaux", "biscuit"];

const InformationShop = ({ onDone, setFormData }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      lastName: "",
      localisation: "Gabès",
      gender: "",
      speciality: [],
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    let doesExist = false;
    try {
      const response = await axios.post(
        "http://localhost:3000/api/shop/check-email",
        {
          email: data.email,
        }
      );
      doesExist = response.data.exists;
    } catch (err) {
      console.error("Error checking email:", err);
    }
    if (doesExist) {
      toast.error("This email already exists");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        ...data,
      },
    }));
    onDone();
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 w-full mx-auto"
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Créer un shop
      </Typography>

      <div className="flex gap-2">
        <Controller
          name="name"
          control={control}
          rules={{ required: "Prénom est requis" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Prénom"
              fullWidth
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ""}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          rules={{ required: "Nom de famille est requis" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nom de famille"
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName ? errors.lastName.message : ""}
            />
          )}
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <InputLabel
            sx={{
              fontSize: 12,
              mb: 0.5,
              display: "flex",
              alignItems: "center",
            }}
          >
            Localisation {infoIcon}
          </InputLabel>
          <Controller
            name="localisation"
            control={control}
            render={({ field }) => (
              <Select {...field} fullWidth>
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {t(`homepage.cities.${city}`)}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </div>

        <div className="flex-1">
          <InputLabel
            sx={{
              fontSize: 12,
              mb: 0.5,
              display: "flex",
              alignItems: "center",
            }}
          >
            Genre {infoIcon}
          </InputLabel>
          <Controller
            name="gender"
            control={control}
            rules={{ required: "Veuillez sélectionner un genre" }}
            render={({ field }) => (
              <RadioGroup
                row
                {...field}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  // justifyContent: "space-between",
                  // border: "1px solid #ccc",
                  // paddingLeft: "12px",
                }}
              >
                {["Femme", "Homme"].map((g) => (
                  <FormControlLabel
                    sx={{
                      // border: "1px solid #ccc",
                      borderRadius: "4px",
                      // paddingY: "5px",
                      // paddingRight: "12px",
                    }}
                    key={g}
                    value={g}
                    control={<Radio color="primary" />}
                    label={g}
                  />
                ))}
              </RadioGroup>
            )}
          />
          {errors.gender && (
            <FormHelperText error>{errors.gender.message}</FormHelperText>
          )}
        </div>
      </div>
      <div>
        <InputLabel
          sx={{ fontSize: 12, mb: 0.5, display: "flex", alignItems: "center" }}
        >
          Specialité {infoIcon}
        </InputLabel>
        <Controller
          name="speciality"
          control={control}
          rules={{
            validate: (value) =>
              value.length > 0 ||
              "Veuillez sélectionner au moins une spécialité",
          }}
          render={({ field }) => (
            <div className="flex flex-wrap justify-between items-center pl-3 gap-y-1">
              {specialties.map((item) => (
                <FormControlLabel
                  key={item}
                  label={item}
                  control={
                    <Checkbox
                      checked={field.value.includes(item)}
                      onChange={() => {
                        if (field.value.includes(item)) {
                          field.onChange(field.value.filter((i) => i !== item));
                        } else {
                          field.onChange([...field.value, item]);
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
            </div>
          )}
        />
        {errors.speciality && (
          <FormHelperText error>{errors.speciality.message}</FormHelperText>
        )}
      </div>

      <Controller
        name="email"
        control={control}
        rules={{
          required: "Email est requis",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Email invalide",
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Votre e-mail"
            type="email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
          />
        )}
      />

      <Controller
        name="password"
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
            label="Mot de passe"
            type="password"
            fullWidth
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ mt: 1 }}
      >
        {loading ? <CircularProgress size={24} /> : "Continue"}
      </Button>
    </form>
  );
};

export default InformationShop;

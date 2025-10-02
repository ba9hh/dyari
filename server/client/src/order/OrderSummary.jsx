import { Controller } from "react-hook-form";
import { TextField, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const OrderSummary = ({ control, errors, watchItems, today }) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Phone number */}
        <div className="flex-1">
          <Controller
            name="userPhoneNumber"
            control={control}
            rules={{
              required: "Téléphone requis",
              pattern: { value: /^[2459]\d{7}$/, message: "Numéro invalide" },
            }}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Votre numéro de téléphone"
                {...field}
                error={!!errors.userPhoneNumber}
                helperText={errors.userPhoneNumber?.message}
                sx={{ mb: 2 }}
              />
            )}
          />
        </div>

        {/* Date */}
        <div className="flex-1">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name="date"
              control={control}
              defaultValue={null}
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <DatePicker
                  label="Select a date"
                  value={field.value}
                  onChange={(newValue) => field.onChange(newValue)}
                  minDate={today}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.date}
                      helperText={errors.date?.message}
                    />
                  )}
                />
              )}
            />
            {errors.date && (
              <Typography
                variant="caption"
                color="error"
                sx={{ marginLeft: "14px" }}
              >
                {errors.date.message}
              </Typography>
            )}
          </LocalizationProvider>
        </div>
      </div>

      {/* Total */}
      <Typography variant="h6" align="center" sx={{ mb: 2, width: "100%" }}>
        Total:{" "}
        {watchItems.reduce(
          (sum, itm) => sum + (itm.price || 0) * (itm.quantity || 0),
          0
        )}{" "}
        dt
      </Typography>
    </>
  );
};

export default OrderSummary;

import { Controller } from "react-hook-form";
import { TextField, Typography } from "@mui/material";
import biscuit50 from "../assets/biscuit50.jpg";

const OrderItem = ({
  index,
  control,
  errors,
  watchItems,
  handleOpenDialog,
}) => {
  return (
    <div className="mb-2">
      <Typography variant="subtitle2">Article {index + 1}</Typography>
      <div className="relative flex items-center justify-center space-x-2 mt-8 ">
        {!watchItems[index]?.image && (
          <div className="absolute flex flex-col justify-center animate-wiggle w-full pl-6">
            <h1 className="text-2xl">
              <span className="text-sm hidden sm:block">
                (select article first)
              </span>{" "}
              👉
            </h1>
          </div>
        )}
        <img
          src={watchItems[index].image || biscuit50}
          alt="article"
          style={{ width: "25%", cursor: "pointer" }}
          onClick={() => handleOpenDialog(index)}
          className="z-10 relative"
        />
      </div>

      <div className="flex gap-2 items-center w-full mt-4">
        <div className="w-full">
          <div className="flex gap-2 mt-2">
            {/* Type (readonly) */}
            <Controller
              name={`items.${index}.type`}
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Unité de vente"
                  {...field}
                  value={field.value || ""}
                  InputProps={{ readOnly: true }}
                />
              )}
            />

            {/* Price (readonly) */}
            <Controller
              name={`items.${index}.price`}
              control={control}
              render={({ field }) => (
                <TextField
                  type="number"
                  fullWidth
                  label="Prix (dt)"
                  {...field}
                  value={field.value || ""}
                  InputProps={{ readOnly: true }}
                />
              )}
            />
          </div>

          {/* Quantity */}
          <Controller
            name={`items.${index}.quantity`}
            control={control}
            rules={{ min: { value: 1, message: "Quantity must be > 0" } }}
            render={({ field }) => (
              <TextField
                type="number"
                fullWidth
                label="Quantité"
                {...field}
                error={!!errors.items?.[index]?.quantity}
                helperText={errors.items?.[index]?.quantity?.message}
                sx={{ mt: 2 }}
              />
            )}
          />

          {/* Subtotal */}
          <Typography variant="body2" sx={{ mt: 1 }}>
            Sous-total:{" "}
            {(watchItems[index].price || 0) * (watchItems[index].quantity || 0)}{" "}
            dt
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;

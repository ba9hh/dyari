import { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthProvider";
import { toast } from "react-toastify";
import biscuit50 from "../assets/biscuit50.jpg";
import Dyari from "../components/Dyari";
import LoginRequiredDialog from "../components/LoginRequiredDialog";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "../components/Pagination";

const Order = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [shopData, setShopData] = useState([]);
  const [openDialog, setOpenDialog] = useState({ open: false, index: null });
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 8;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userPhoneNumber: "",
      items: [{ articleId: "", type: "", quantity: null, price: 0, image: "" }],
      date: null,
    },
  });
  const { fields, append } = useFieldArray({
    control,
    name: "items",
  });
  if (errors?.date) {
    setValue("date", "");
  }
  const watchItems = watch("items");

  useEffect(() => {
    const fetchShopArticles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://dyari.onrender.com/api/shop/${id}/articles?page=${page}&limit=${LIMIT}`
        );
        setShopData(response.data.articles);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching shop articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopArticles();
  }, [id, page]);
  const handleClose = () => {
    setIsConnected(false);
  };
  const handleOpenDialog = (index) => setOpenDialog({ open: true, index });
  const handleCloseDialog = () => setOpenDialog({ open: false, index: null });

  const selectImage = (image, type, price, articleId) => {
    setValue(`items.${openDialog.index}.image`, image);
    setValue(`items.${openDialog.index}.type`, type);
    setValue(`items.${openDialog.index}.price`, price);
    setValue(`items.${openDialog.index}.articleId`, articleId);
    handleCloseDialog();
  };

  const onSubmit = async (data) => {
    if (!user || user?.role == "shop") {
      setIsConnected(true);
      return;
    }
    const phoneRegex = /^[2459]\d{7}$/;
    if (!phoneRegex.test(data.userPhoneNumber)) {
      alert("Please enter a valid phone number.");
      return;
    }
    const allValid = data.items.every(
      (item) => item.articleId && item.quantity > 0
    );
    if (!allValid) {
      alert("Some items are missing required information.");
      return;
    }
    if (!data.date) {
      alert("Please select a date.");
      console.log("Please select a date.");
      return;
    }
    const orderItems = data.items.map((item) => ({
      articleId: item.articleId,
      quantity: item.quantity,
    }));
    const orderTotalAmount = data.items.reduce(
      (sum, itm) => sum + itm.price * itm.quantity,
      0
    );
    const payload = {
      shopId: id,
      userId: user._id,
      userPhoneNumber: data.userPhoneNumber,
      userNeededDate: data.date,
      orderItems,
      orderTotalAmount,
    };
    setLoading(true);
    try {
      const res = await axios.post(
        `https://dyari.onrender.com/api/order`,
        payload
      );
      toast.success("Order added successfully!");
      reset();
    } catch (err) {
      console.error(err);
      alert("Error adding order");
    } finally {
      setLoading(false);
    }
  };
  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  return (
    <div className="flex justify-center w-full min-h-screen bg-white sm:bg-[#f2f2f2] pt-16 pb-8 sm:px-0 px-2">
      <Dyari />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[600px] bg-white p-6 rounded-lg border sm:border:0 sm:shadow-md"
      >
        {fields.map((field, index) => (
          <div key={field.id} className="mb-2">
            <Typography variant="subtitle2">Article {index + 1}</Typography>
            <div className="relative flex items-center justify-center space-x-2 mt-8 ">
              {!watchItems[index]?.image && (
                <div className="absolute flex flex-col justify-center animate-wiggle w-full pl-6">
                  <h1 className="text-2xl">
                    <span className="text-sm hidden sm:block">
                      (select article first)
                    </span>
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
                  <Controller
                    name={`items.${index}.type`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        label="Unité de vente"
                        {...field}
                        value={field.value || ""}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    )}
                  />

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
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    )}
                  />
                </div>

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

                <Typography variant="body2" sx={{ mt: 1 }}>
                  Sous-total:{" "}
                  {(watchItems[index].price || 0) *
                    (watchItems[index].quantity || 0)}{" "}
                  dt
                </Typography>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="outlined"
          fullWidth
          onClick={() => append({ type: "", price: 0, image: "", quantity: 0 })}
          sx={{ mb: 2 }}
        >
          Ajouter un autre article
        </Button>
        <div className="flex flex-col sm:flex-row gap-2">
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

        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Total:{" "}
          {watchItems.reduce(
            (sum, itm) => sum + (itm.price || 0) * (itm.quantity || 0),
            0
          )}{" "}
          dt
        </Typography>

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          color="primary"
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : "Passez votre commande"}
        </Button>
      </form>

      <Dialog
        open={openDialog.open}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Sélectionner un article</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress />
            </Box>
          ) : (
            <div className="columns-2 sm:columns-2 md:columns-3 gap-2">
              {shopData?.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    selectImage(
                      item.articleImage,
                      item.articleType,
                      item.articlePrice,
                      item._id
                    )
                  }
                  className="mb-2 break-inside-avoid cursor-pointer"
                >
                  <img
                    src={item.articleImage}
                    alt="article"
                    style={{ width: "100%" }}
                  />
                </div>
              ))}
            </div>
          )}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrev={handlePrev}
            onNext={handleNext}
            isOrder={true}
          />
        </DialogContent>
      </Dialog>

      <LoginRequiredDialog
        open={isConnected}
        onClose={handleClose}
        message="You must be logged in as a user to pass an order"
      />
    </div>
  );
};

export default Order;

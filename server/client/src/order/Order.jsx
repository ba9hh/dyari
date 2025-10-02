import { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthProvider";
import { toast } from "react-toastify";
import Dyari from "../components/Dyari";
import LoginRequiredDialog from "../components/LoginRequiredDialog";
import "react-datepicker/dist/react-datepicker.css";
import OrderItem from "./OrderItem";
import OrderSummary from "./OrderSummary";
import ArticleDialog from "./ArticleDialog";

const Order = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [shopData, setShopData] = useState([]);
  const [openDialog, setOpenDialog] = useState({ open: false, index: null });
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://dyari.onrender.com/api/shop/${id}/articles?page=${page}&limit=${LIMIT}`
        );
        setShopData(response.data.articles);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching shop articles:", error);
      } finally {
        setIsLoading(false);
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
  return (
    <div className="flex justify-center w-full min-h-screen bg-white sm:bg-[#f2f2f2] pt-16 pb-8 sm:px-0 px-2">
      <Dyari />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[600px] bg-white p-6 rounded-lg border sm:border:0 sm:shadow-md"
      >
        {fields.map((field, index) => (
          <OrderItem
            key={field.id}
            index={index}
            control={control}
            errors={errors}
            watchItems={watchItems}
            handleOpenDialog={handleOpenDialog}
          />
        ))}

        <Button
          variant="outlined"
          fullWidth
          onClick={() =>
            append({ type: "", price: 0, image: "", quantity: null })
          }
          sx={{ mb: 2 }}
        >
          Ajouter un autre article
        </Button>

        <OrderSummary
          control={control}
          errors={errors}
          watchItems={watchItems}
          today={today}
        />

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

      <ArticleDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        shopData={shopData}
        selectImage={selectImage}
        loading={isLoading}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />

      <LoginRequiredDialog
        open={isConnected}
        onClose={handleClose}
        message="You must be logged in as a user to pass an order"
      />
    </div>
  );
};

export default Order;

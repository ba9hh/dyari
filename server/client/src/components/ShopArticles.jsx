import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Slide,
} from "@mui/material";
import { Trash2, Edit2, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}
const ShopArticles = ({ article, onClick, onDelete }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setOpenDialog(false);
    setSnackbarOpen(true);
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };
  return (
    <>
      <div className="relative group" onClick={onClick}>
        <img
          className="w-full border object-cover"
          src={article.articleImage}
        />
        <div className="absolute top-0 right-0 left-0 h-8 p-1 bg-white border opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
          <p className="text-center text-sm font-medium">
            {article.articlePrice} dt par {article.articleType}
          </p>
        </div>
        <div className="flex gap-1 absolute top-1 left-2">
          <button
            onClick={handleDeleteClick}
            className=" p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110"
          >
            <Trash2 size={14} />
          </button>
          <Link
            to={`update-article/${article._id}`}
            className=" p-1 bg-green-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-green-600 hover:scale-110"
          >
            <Pencil size={14} />
          </Link>
        </div>
      </div>
      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this article?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Article deleted successfully
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShopArticles;

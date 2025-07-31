import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Button,
  CircularProgress,
  Typography
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const ArticleShopDialog = ({ articleId, open, onClose }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!articleId || !open) return;
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/article/${articleId}`
        );
        setArticle(response.data);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to load article.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [articleId, open]);

  // Build title with price
  const renderTitle = () => {
    if (!article) return 'Article';
    return `${article.articleTitle} (${article.articlePrice} Dt per ${article.articleType})`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {renderTitle()}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: theme => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : article ? (
          <Box>
            <Box
              component="img"
              src={article.articleImage}
              alt={article.articleTitle}
              sx={{ width: '100%', borderRadius: 1 }}
            />
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ArticleShopDialog;

import ArticleShop from "./ArticleShop";
import { useState, useEffect } from "react";
import axios from "axios";
import ShopArticles from "../../components/shopArticles";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import Button from "@mui/material/Button";
import ArticlesSkeleton from "../../skeleton/shop-profile/ArticlesSkeleton";

const ArticlesShop = ({ shopId }) => {
  const [articles, setArticles] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const LIMIT = 8;
   
  useEffect(() => {
    const fetchShopArticles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/shop/${shopId}/articles?page=${page}&limit=${LIMIT}`
        );
        setArticles(response.data.articles);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShopArticles();
  }, [shopId,page]);
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
  const handleDeleteArticle = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/article/${id}`);
      setArticles((prev) => prev.filter((article) => article._id !== id));
      toast.success("Article deleted successfully");
    } catch (err) {
      console.error(err);
    }
  };
  if(loading){
    return <ArticlesSkeleton />
  }
  return (
    <div className="w-full sm:w-2/3 bg-white shadow-md rounded-md pt-4 pb-8">
      <div className="flex justify-end w-full px-8">
        <Button
          component={Link}
          to="add-article"
          variant="contained"
          color="primary"
          size="small"
          sx={{
            textTransform: "none",
          }}
        >
          Add article
        </Button>
      </div>
      <div className="columns-2 sm:columns-2 md:columns-3 gap-x-2 gap-y-2 sm:px-8 mt-4">
        {articles?.map((article, index) => (
          <div key={index} className="mb-2 break-inside-avoid">
            <ShopArticles
              article={article}
              onClick={() => setSelectedArticleId(article._id)}
              onDelete={() => handleDeleteArticle(article._id)}
            />
          </div>
        ))}
      </div>
      {selectedArticleId && (
        <ArticleShop
          articleId={selectedArticleId}
          onClose={() => setSelectedArticleId(null)}
        />
      )}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
};

export default ArticlesShop;

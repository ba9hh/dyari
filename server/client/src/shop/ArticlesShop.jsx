import { useState, useEffect } from "react";
import axios from "axios";
import ArticleShop from "./ArticleShop";
import Articles from "../components/Articles";
import SkeletonArticlesShop from "./SkeletonArticlesShop";
import ArticleShopDialog from "../components/ArticleShopDialog";
import Pagination from "../components/Pagination";

const ArticlesShop = ({ shopId }) => {
    const [open, setOpen] = useState(false);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
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
        console.error("Error fetching shop articles:", error);
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
  const handleOpenDialog = (articleId) => {
    setSelectedArticleId(articleId);
    setOpen(true);
  };

  // Close dialog and reset selection
  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedArticleId(null);
  };
  if (loading) return <SkeletonArticlesShop />;
  return (
    <div className="w-full sm:w-2/3 bg-white sm:shadow-md rounded-md py-3">
      {/* <span className="font-medium text-black my-2 ml-7 border-b pb-1 border-gray-700">
          Travail de {shop.name}
        </span> */}
      <div className="columns-2 sm:columns-2 md:columns-3 gap-x-2 gap-y-2 sm:px-8 mt-4">
        {articles?.map((article, index) => (
          <div key={index} className="mb-2 break-inside-avoid">
            <Articles
              article={article}
              onClick={() => handleOpenDialog(article._id)}
            />
          </div>
        ))}
      </div>
      {/* {selectedArticleId && (
        <ArticleShopDialog
          articleId={selectedArticleId}
          onClose={() => setSelectedArticleId(null)}
        />
      )} */}
      <ArticleShopDialog
        articleId={selectedArticleId}
        open={open}
        onClose={handleCloseDialog}
      />
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

import { useEffect } from "react";
import axios from "axios";
import React, { useState } from "react";

const ArticleShop = ({ articleId, onClose }) => {
  const [article, setArticle] = useState([]);
  useEffect(() => {
    const fetchShopArticles = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/article/${articleId}`
        );
        setArticle(response.data);
      } catch (error) {
        console.error("Error fetching shop articles:", error);
      }
    };

    fetchShopArticles();
  }, []);
  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
        <div className="flex gap-2 bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg border border-red-600">
          {/* Close Button */}
          <button
           onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            ✕
          </button>
          <h1
            className="absolute bottom-6 right-6 text-gray-500 hover:text-black"
          >
            {article.articlePrice} Dt par {article.articleType}
          </h1>
          <img
            className="w-full border border-green-600 object-cover"
            src={article.articleImage}
          />
          {/* Article Content */}
          <div>
            <h2 className="text-xl font-bold mb-1">{article.articleTitle}</h2>
            <p className="text-gray-700">{article.articleDescription}</p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleShop;

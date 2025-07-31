import React from "react";

const Articles = ({ article, onClick }) => {
  return (
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
    </div>
  );
};

export default Articles;

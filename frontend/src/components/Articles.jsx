import React from "react";

const Articles = ({article}) => {
  return (
    <div className="relative group">
      <img className="w-full h-72 border object-cover" src={article.image} />
      <div className="absolute top-0 right-0 left-0 h-8 p-1 bg-white border opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
        <p className="text-center text-sm font-medium">
          {article.price} dt par {article.type}
        </p>
      </div>
    </div>
  );
};

export default Articles;

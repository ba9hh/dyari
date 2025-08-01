import React from "react";
import Skeleton from "react-loading-skeleton";
const LikedShopsSkeleton = () => {
  return (
    <div className="w-full sm:w-2/3 bg-white shadow-md rounded-md py-2 sm:py-8 px-3">
      <div className="flex justify-between items-center border px-2 py-2 rounded mb-2">
        <div className="flex gap-2">
          <Skeleton width={40} height={40} circle />
          <div>
            <Skeleton width={80} height={20} />
            <Skeleton width={160} height={20} />
          </div>
        </div>
        <div className="flex items-center">
          <Skeleton width={80} height={10} />
          <Skeleton width={20} height={10} />
        </div>
      </div>
      <div className="flex justify-between items-center border px-2 py-2 rounded mb-2">
        <div className="flex gap-2">
          <Skeleton width={40} height={40} circle />
          <div>
            <Skeleton width={80} height={20} />
            <Skeleton width={160} height={20} />
          </div>
        </div>
        <div className="flex items-center">
          <Skeleton width={80} height={10} />
          <Skeleton width={20} height={10} />
        </div>
      </div>
      <div className="flex justify-between items-center border px-2 py-2 rounded mb-2">
        {" "}
        <div className="flex gap-2">
          <Skeleton width={40} height={40} circle />
          <div>
            <Skeleton width={80} height={20} />
            <Skeleton width={160} height={20} />
          </div>
        </div>
        <div className="flex items-center">
          <Skeleton width={80} height={10} />
          <Skeleton width={20} height={10} />
        </div>
      </div>
      <div className="flex justify-between items-center border px-2 py-2 rounded">
        {" "}
        <div className="flex gap-2">
          <Skeleton width={40} height={40} circle />
          <div>
            <Skeleton width={80} height={20} />
            <Skeleton width={160} height={20} />
          </div>
        </div>
        <div className="flex items-center">
          <Skeleton width={80} height={10} />
          <Skeleton width={20} height={10} />
        </div>
      </div>
    </div>
  );
};

export default LikedShopsSkeleton;

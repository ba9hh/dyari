import React from "react";
import Skeleton from "react-loading-skeleton";

const OrdersSkeleton = () => {
  return (
    <div className="pt-3">
      <div className="flex justify-center w-full py-2">
        <Skeleton width={150} height={20} />
      </div>
      <div className="w-full rounded-[4px] p-2">
        <div className="flex justify-between items-center">
          <div className="">
            <Skeleton width={150} height={18} />
            <Skeleton width={230} height={18} />
          </div>
          <Skeleton width={200} height={18} />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-3">
            <Skeleton className="w-full aspect-[11/16]" />
            <div>
              <Skeleton width={100} height={18} />
              <Skeleton width={100} height={18} />
            </div>
          </div>
          <div className="p-3">
            <Skeleton className="w-full aspect-[11/16]" />
            <div>
              <Skeleton width={100} height={18} />
              <Skeleton width={100} height={18} />
            </div>
          </div>
          <div className="p-3">
            <Skeleton className="w-full aspect-[11/16]" />
            <div>
              <Skeleton width={100} height={18} />
              <Skeleton width={100} height={18} />
            </div>
          </div>
          <div className="p-3">
            <Skeleton className="w-full aspect-[11/16]" />
            <div>
              <Skeleton width={100} height={18} />
              <Skeleton width={100} height={18} />
            </div>
          </div>
        </div>
        <div className="flex justify-end pl-3 pr-1 py-2">
          <div>
            <Skeleton width={200} height={18} />
            <Skeleton width={250} height={18} />
            <Skeleton width={100} height={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersSkeleton;

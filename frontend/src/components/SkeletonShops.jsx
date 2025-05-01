import React from "react";
import Skeleton from "react-loading-skeleton";

const SkeletonShops = () => {
  return (
    <div>
      <div className="flex justify-end py-3 px-8">
          <Skeleton width={160} height={36}/>
      </div>
      <div className="lg:grid-cols-2 md:grid-cols-2 grid grid-cols-1 gap-x-16 gap-y-20 mx-20 mb-20 mt-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i}>
              <div className="flex justify-between items-center">
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
              <div className="grid grid-cols-3 gap-1 mt-1">
                <Skeleton className="w-full h-56 border" />
                <Skeleton className="w-full h-56 border" />
                <Skeleton className="w-full h-56 border" />
                <Skeleton className="w-full h-56 border" />
                <Skeleton className="w-full h-56 border" />
                <Skeleton className="w-full h-56 border" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SkeletonShops;

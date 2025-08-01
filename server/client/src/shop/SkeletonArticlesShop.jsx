import Skeleton from "react-loading-skeleton";
const SkeletonArticlesShop = () => {
  return (
    <div className="w-2/3 bg-white shadow-md rounded-md py-3">
      <div className="grid grid-cols-3 gap-x-6 gap-y-6 px-8 mt-4">
        <Skeleton width={"100%"} height={400} />
        <Skeleton width={"100%"} height={400} />
        <Skeleton width={"100%"} height={400} />
      </div>
    </div>
  );
};

export default SkeletonArticlesShop;

import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import biscuit50 from "../assets/biscuit50.jpg";

const ShopHome = ({ shop }) => {
  return (
    <Link
      to={`/insideshop/${shop._id}`}
      className="bg-white sm:shadow-md pb-3 pt-3 sm:py-3 sm:rounded-md sm:border-b-0 border-b-[4px] border-gray-300"
    >
      <div className="flex justify-between items-center sm:px-5 px-3">
        <div className="flex relative flex-1 gap-2">
          <img
            className="w-10 h-10 rounded-full border"
            src={shop.profilePicture}
            alt="Shop Profile"
          />
          <div>
            <div className="overflow-x-auto sm:max-w-full max-w-[200px] whitespace-nowrap scrollbar-hide">
              <h1 className="my-0">
                {shop.name} {shop.lastName} ({shop.localisation})
              </h1>
            </div>
            <div className="overflow-x-auto sm:max-w-full max-w-[200px] whitespace-nowrap scrollbar-hide">
              {shop.speciality?.length == 1 && (
                <span className="crimsonText inline-block  my-0">
                  Specialité : {shop.speciality?.[0]}
                </span>
              )}
              {shop.speciality?.length == 2 && (
                <span className="crimsonText inline-block my-0">
                  Specialité : {shop.speciality?.[0]} et {shop.speciality?.[1]}
                </span>
              )}
              {shop.speciality?.length == 3 && (
                <span className="crimsonText inline-block my-0">
                  Specialité : {shop.speciality?.[0]} , {shop.speciality?.[1]}{" "}
                  et {shop.speciality?.[2]}
                </span>
              )}
              {shop.speciality?.length == 4 && (
                <span className="crimsonText inline-block my-0">
                  Specialité : {shop.speciality?.[0]} , {shop.speciality?.[1]} ,{" "}
                  {shop.speciality?.[2]} et {shop.speciality?.[3]}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center ">
          <h1>{shop.averageRating}</h1>
          <ReactStars
            count={5}
            size={20}
            value={shop.averageRating || 0}
            isHalf={true}
            edit={false}
            activeColor="#FBBC04"
          />
          <h1>({shop.totalRating})</h1>
        </div>
      </div>
      {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mt-1 sm:border-b-0 border-b-[3px] border-gray-300 sm:px-5">
        {shop.articles
          ?.slice(0, 6)
          .map((article, index) =>
            article?.articleImage ? (
              <img
                key={index}
                className="w-full aspect-[12/16] border object-cover"
                src={article.articleImage}
              />
            ) : (
              <img
                key={index}
                className="w-full aspect-[12/16] border object-cover sm:hidden"
                src={biscuit50}
              />
            )
          )}
      </div> */}
      <div className="relative sm:px-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:mt-1 mt-3  ">
          {shop.articles?.slice(0, 3).map((article, index) => {
            // hide index 4 & 5 on xs, show from sm+
            const hideOnXs = index >= 4 ? "hidden sm:block" : "";

            return (
              <img
                key={index}
                className={`${hideOnXs} w-full aspect-[12/16] border object-cover`}
                src={article?.articleImage ?? biscuit50}
              />
            );
          })}
        </div>
        {shop.numberOfArticles > 4 && (
          <div className="absolute right-0 sm:right-5 bottom-0 bg-gray-100 text-gray-500 font-bold text-md p-2 rounded-ss-md border-2 sm:hidden">
            {`+${shop.numberOfArticles - 4}`}
          </div>
        )}
        {shop.numberOfArticles > 3 && (
          <div className="absolute right-0 sm:right-5 bottom-0 bg-gray-100 text-gray-500 font-bold text-md p-2 rounded-ss-md border-2 hidden sm:block">
            {`+${shop.numberOfArticles - 3}`}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ShopHome;
